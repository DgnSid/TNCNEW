import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { incrementVotingTeamVotes } from '../lib/adminData';

const PaymentCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        let paymentId = params.get('payment');

        // Hash router ajoute le paramètre après #
        if (!paymentId && window.location.hash) {
          const hashQuery = window.location.hash.split('?')[1] || '';
          paymentId = new URLSearchParams(hashQuery).get('payment');
        }

        if (!paymentId) {
          setStatus('error');
          setMessage('ID de paiement manquant');
          return;
        }

        // Simuler la vérification du paiement (dans un vrai projet, faire un appel API)
        const paymentData = JSON.parse(localStorage.getItem(paymentId) || '{}');

        if (!paymentData?.teamId || !paymentData?.voteCount) {
          setStatus('error');
          setMessage('Données de paiement invalides');
          return;
        }

        // Mise à jour des votes en base
        const ok = await incrementVotingTeamVotes(paymentData.teamId, paymentData.voteCount);
        if (!ok) {
          setStatus('error');
          setMessage('Impossible de mettre à jour les votes en base');
          return;
        }

        setStatus('success');
        setMessage(`Paiement de ${paymentData.amount?.toLocaleString() || '0'} FCFA confirmé pour ${paymentData.voteCount || 0} vote(s).`);

        // Nettoyage et redirection auto après 3 secondes
        localStorage.removeItem(paymentId);
        setTimeout(() => {
          window.location.href = '/#/vote';
        }, 3000);

      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        setStatus('error');
        setMessage('Erreur lors du traitement du paiement');
      }
    };

    handlePaymentCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 text-center shadow-xl"
      >
        {status === 'loading' && (
          <>
            <Loader2 size={64} className="mx-auto mb-6 text-nova-violet animate-spin" />
            <h1 className="text-2xl font-black text-nova-black uppercase tracking-tighter mb-4">
              Traitement du Paiement
            </h1>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous confirmons votre paiement...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={64} className="mx-auto mb-6 text-green-500" />
            <h1 className="text-2xl font-black text-nova-black uppercase tracking-tighter mb-4">
              Paiement Réussi
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500">
              Redirection automatique dans quelques secondes...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={64} className="mx-auto mb-6 text-red-500" />
            <h1 className="text-2xl font-black text-nova-black uppercase tracking-tighter mb-4">
              Erreur de Paiement
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <button
              onClick={() => navigate('/vote')}
              className="w-full bg-nova-violet text-white py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-nova-violet/80 transition-colors"
            >
              Retour aux Votes
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;