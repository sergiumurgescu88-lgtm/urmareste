import { ApifyClient } from 'apify-client';
import { query } from './db.js';

const APIFY_TOKEN = 'YOUR_APIFY_TOKEN_HERE';
const client = new ApifyClient({ token: APIFY_TOKEN });

const searches = [
  "Instalatori Sector 1 Bucuresti",
  "Instalatori Sector 3 Bucuresti",
  "Electricieni Sector 1 Bucuresti",
  "Electricieni Sector 3 Bucuresti",
  "Zugravi Sector 2 Bucuresti",
  "Firma curatenie Sector 3 Bucuresti"
];

async function run() {
  console.log("🚀 Pornire extracție date reale de pe Google Maps (Free Actor)...\n");
  let totalInserted = 0;

  for (const search of searches) {
    console.log(`🔍 Căutare: "${search}"`);
    try {
      // Folosim actorul gratuit dtrungtin/google-maps-scraper
      const run = await client.actor("dtrungtin/google-maps-scraper").call({
        searches: [search],
        maxResults: 15,
        language: "ro"
      });

      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      let insertedInThisSearch = 0;

      for (const item of items) {
        const phone = item.phone || (item.phones && item.phones[0]) || '';
        const rating = item.rating || 0;

        // Filtrăm: doar firmele cu telefon și rating > 3.5
        if (!phone || rating < 3.5) continue;

        const nume = item.title;
        const telefon = phone.replace(/\s+/g, '');
        const descriere = item.description || `Firmă locală cu rating ${rating} pe Google. Servicii profesionale în București.`;
        const website = item.website || '';
        const email = item.email || '';

        const res = await query(
          `INSERT INTO business (nume, descriere, telefon, email, website, activ, is_verified, plan) 
           VALUES ($1, $2, $3, $4, $5, TRUE, FALSE, 'free') 
           ON CONFLICT (nume) DO NOTHING 
           RETURNING id`,
          [nume, descriere, telefon, email, website]
        );

        if (res.rows.length > 0) {
          const bizId = res.rows[0].id;
          console.log(`   ✅ Adăugat: ${nume} (ID: ${bizId})`);
          insertedInThisSearch++;
          totalInserted++;
        }
      }
      console.log(`   -> ${insertedInThisSearch} firme noi adăugate.\n`);
      
    } catch (err) {
      console.error(`   ❌ Eroare la căutarea "${search}":`, err.message);
    }
  }

  console.log(`\n🎉 GATA! Total firme reale adăugate în baza de date: ${totalInserted}`);
}

run().catch(console.error);
