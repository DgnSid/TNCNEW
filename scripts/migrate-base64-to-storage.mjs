import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const loadEnvFile = (filename, override = false) => {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim().replace(/^export\s+/, '');
    let value = line.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!override && process.env[key] !== undefined) continue;
    process.env[key] = value;
  }
};

loadEnvFile('.env');
loadEnvFile('.env.local', true);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || process.env.VITE_SUPABASE_STORAGE_BUCKET || 'tnc-media';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const TABLES = [
  { table: 'voting_teams', column: 'image_url', folder: 'voting-teams' },
  { table: 'partners', column: 'logo_url', folder: 'partners' },
  { table: 'live_phases', column: 'image_url', folder: 'live-phases' },
];

const isDryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : null;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const mimeToExt = (mime) => {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/gif':
      return 'gif';
    case 'image/svg+xml':
      return 'svg';
    case 'image/avif':
      return 'avif';
    default:
      return 'jpg';
  }
};

const parseDataUrl = (value) => {
  if (typeof value !== 'string') return null;
  if (!value.startsWith('data:image/')) return null;
  const match = value.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return null;
  const mime = match[1];
  const base64 = match[2];
  return { mime, base64 };
};

const migrateTable = async ({ table, column, folder }) => {
  console.log(`\n[${table}.${column}] scanning...`);

  let query = supabase.from(table).select(`id, ${column}`);
  if (LIMIT) query = query.limit(LIMIT);

  const { data, error } = await query;
  if (error) {
    console.error(`Failed to fetch ${table}:`, error.message);
    return;
  }
  if (!data || data.length === 0) {
    console.log('No rows found.');
    return;
  }

  let processed = 0;
  let migrated = 0;

  for (const row of data) {
    processed += 1;
    const parsed = parseDataUrl(row[column]);
    if (!parsed) continue;

    const ext = mimeToExt(parsed.mime);
    const fileName = `${row.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `${folder}/${fileName}`;

    if (isDryRun) {
      console.log(`DRY RUN: ${table}.${column} id=${row.id} -> ${filePath}`);
      migrated += 1;
      continue;
    }

    const buffer = Buffer.from(parsed.base64, 'base64');

    const { error: uploadError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: parsed.mime,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error(`Upload failed for ${table} id=${row.id}:`, uploadError.message);
      continue;
    }

    const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    const publicUrl = pub?.publicUrl;

    if (!publicUrl) {
      console.error(`Failed to get public URL for ${filePath}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from(table)
      .update({ [column]: publicUrl })
      .eq('id', row.id);

    if (updateError) {
      console.error(`Update failed for ${table} id=${row.id}:`, updateError.message);
      continue;
    }

    migrated += 1;
    if (migrated % 10 === 0) {
      console.log(`Migrated ${migrated} so far...`);
    }
  }

  console.log(`Done. processed=${processed}, migrated=${migrated}`);
};

const main = async () => {
  console.log('Starting migration...');
  console.log(`Bucket: ${STORAGE_BUCKET}`);
  console.log(`Dry run: ${isDryRun ? 'yes' : 'no'}`);
  for (const item of TABLES) {
    await migrateTable(item);
  }
  console.log('Migration complete.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
