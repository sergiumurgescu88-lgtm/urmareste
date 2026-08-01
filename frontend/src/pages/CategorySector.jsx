import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORII } from '../data/categories.js';
import { SECTOARE } from '../data/sectors.js';

export default function CategorySector() {
  const { categorySlug, sectorSlug } = useParams();
  
  const categorie = CATEGORII.find((c) => c.slug === categorySlug);
  const sector = SECTOARE.find((s) => s.slug === sectorSlug);

  // Citește starea pre-încărcată de scriptul de SSG, dacă există
  const preloaded = window.__PRELOADED_STATE__?.[`${categorySlug}/${sectorSlug}`];
  
  const [listari, setListari] = useState(preloaded || []);
  const [loading, setLoading] = useState(!preloaded);
  const [doarVerificati, setDoarVerificati] = useState(false);

  useEffect(() => {
    // Dacă nu avem date pre-încărcate (ex: navigare client-side), facem fetch
    if (!preloaded || doarVerificati) {
      setLoading(true);
      const params = new URLSearchParams({ category: categorySlug, sector: sectorSlug });
      if (doarVerificati) params.set('verified', 'true');

      fetch(`/api/business?${params}`)
        .then((r) => r.json())
        .then(setListari)
        .catch(() => setListari([]))
        .finally(() => setLoading(false));
    }
  }, [categorySlug, sectorSlug, doarVerificati, preloaded]);

  if (!categorie || !sector) {
    return <p>Pagina nu a fost găsită.</p>;
  }

  return (
    <>
      <h1 className="display" style={{ fontSize: 28, marginBottom: 8 }}>
        {categorie.nume} — {sector.nume}
      </h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
        Meseriași verificați și disponibili în {sector.nume}, {sector.tip === 'ilfov' ? 'județul Ilfov' : 'București'}.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <input
          type="checkbox"
          style={{ width: 'auto' }}
          checked={doarVerificati}
          onChange={(e) => setDoarVerificati(e.target.checked)}
        />
        Doar meseriași verificați
      </label>

      {loading && <p>Se încarcă...</p>}

      {!loading && listari.length === 0 && (
        <div className="card">
          <p>Încă nu avem meseriași listați pentru {categorie.nume.toLowerCase()} în {sector.nume}.</p>
          <Link to="/listeaza-te" className="btn" style={{ marginTop: 12, display: 'inline-block' }}>
            Fii primul listat aici
          </Link>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
        {listari.map((b) => (
          <Link key={b.id} to={`/profil/${b.id}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {b.nume}
                {b.is_verified && <span className="badge badge-verified" style={{ marginLeft: 8 }}>Verificat</span>}
                {b.plan === 'elite' && <span className="badge badge-elite" style={{ marginLeft: 8 }}>Elite</span>}
                {b.plan === 'premium' && <span className="badge badge-premium" style={{ marginLeft: 8 }}>Premium</span>}
              </div>
              <div style={{ color: 'var(--text-dim)', fontSize: 14 }}>{b.descriere?.slice(0, 100)}</div>
            </div>
            {b.rating_mediu && <div style={{ color: 'var(--gold-light)' }}>★ {b.rating_mediu}</div>}
          </Link>
        ))}
      </div>
    </>
  );
}
