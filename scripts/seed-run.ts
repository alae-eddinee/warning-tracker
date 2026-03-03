import { createClient } from '@supabase/supabase-js';
import { CLIENTS_DATA, ENSEIGNES } from './seed.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🚀 Starting database seed...');
  console.log(`📊 Found ${ENSEIGNES.length} enseignes and ${CLIENTS_DATA.length} stores\n`);

  // Insert enseignes
  console.log('📝 Inserting enseignes...');
  const enseigneData = ENSEIGNES.map(name => ({ name }));
  const { error: enseigneError } = await supabase
    .from('enseignes')
    .upsert(enseigneData, { onConflict: 'name' });

  if (enseigneError) {
    console.error('❌ Error inserting enseignes:', enseigneError);
    return;
  }
  console.log(`✅ Inserted ${ENSEIGNES.length} enseignes\n`);

  // Get all enseignes with their IDs
  const { data: enseignes, error: fetchError } = await supabase
    .from('enseignes')
    .select('id, name');

  if (fetchError || !enseignes) {
    console.error('❌ Error fetching enseignes:', fetchError);
    return;
  }

  const enseigneMap = new Map(enseignes.map(e => [e.name, e.id]));

  // Insert stores in batches
  console.log('🏪 Inserting stores...');
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < CLIENTS_DATA.length; i += batchSize) {
    const batch = CLIENTS_DATA.slice(i, i + batchSize);
    const storeData = batch.map(client => ({
      name: client.raison_sociale,
      enseigne_id: enseigneMap.get(client.enseigne),
    }));

    const { error: storeError } = await supabase
      .from('stores')
      .upsert(storeData, { onConflict: 'name,enseigne_id' });

    if (storeError) {
      console.error(`❌ Error inserting stores batch ${i / batchSize + 1}:`, storeError);
    } else {
      inserted += batch.length;
      process.stdout.write(`\r✅ Progress: ${inserted}/${CLIENTS_DATA.length} stores inserted`);
    }
  }

  console.log('\n\n🎉 Database seed complete!');
  console.log(`📈 Summary: ${ENSEIGNES.length} enseignes, ${CLIENTS_DATA.length} stores`);
}

seedDatabase().catch(console.error);
