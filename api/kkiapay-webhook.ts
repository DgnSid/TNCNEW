import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { kkiapay } from '@kkiapay-org/nodejs-sdk';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const k = kkiapay({
  privatekey: process.env.KKIAPAY_PRIVATE_KEY!,
  publickey: process.env.KKIAPAY_PUBLIC_KEY!,
  secretkey: process.env.KKIAPAY_SECRET_KEY!,
  sandbox: false,
});

interface KkiapayWebhookPayload {
  transactionId: string;
  isPaymentSucces: boolean;
  amount: number;
  event: 'transaction.success' | 'transaction.failed';
  stateData?: unknown;
}

const extractPaymentId = (stateData: unknown): string | null => {
  if (typeof stateData === 'string' && stateData.startsWith('vote_')) return stateData;
  if (stateData && typeof stateData === 'object' && 'data' in stateData) {
    const value = (stateData as { data?: unknown }).data;
    if (typeof value === 'string' && value.startsWith('vote_')) return value;
  }
  return null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  if (req.headers['x-kkiapay-secret'] !== process.env.KKIAPAY_WEBHOOK_SECRET) {
    res.status(401).send('Invalid webhook secret');
    return;
  }

  const payload = req.body as KkiapayWebhookPayload;

  if (payload.event !== 'transaction.success' || !payload.isPaymentSucces) {
    res.status(200).send('Ignored: not a successful payment event');
    return;
  }

  let paymentId = extractPaymentId(payload.stateData);

  if (!paymentId) {
    const { data: candidate } = await supabase
      .from('vote_transactions')
      .select('id')
      .eq('status', 'pending')
      .eq('amount', payload.amount)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    paymentId = candidate?.id ?? null;
  }

  if (!paymentId) {
    console.error('kkiapay-webhook: unable to resolve paymentId', payload.transactionId);
    res.status(200).send('Acknowledged: no matching vote_transaction found');
    return;
  }

  try {
    const verification = await k.verify(payload.transactionId);
    if (verification.status !== 'SUCCESS' || verification.amount !== payload.amount) {
      console.error('kkiapay-webhook: verification mismatch', payload.transactionId, verification);
      res.status(200).send('Acknowledged: verification mismatch');
      return;
    }
  } catch (error) {
    console.error('kkiapay-webhook: verify() failed, will retry', error);
    res.status(500).send('Verification failed, retry');
    return;
  }

  await supabase
    .from('vote_transactions')
    .update({ kkiapay_transaction_id: payload.transactionId })
    .eq('id', paymentId)
    .eq('status', 'pending');

  const { data: confirmed, error } = await supabase.rpc('confirm_vote_transaction', { p_id: paymentId });

  if (error) {
    console.error('kkiapay-webhook: confirm_vote_transaction failed, will retry', error);
    res.status(500).send('Database error, retry');
    return;
  }

  res.status(200).send(confirmed ? 'Vote confirmed' : 'Already processed');
}
