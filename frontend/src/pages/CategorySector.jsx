import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORII } from '../data/categories.js';
import { SECTOARE } from '../data/sectors.js';

export default function CategorySector() {
  const { categorySlug, sectorSlug } = useParams();
  const categorie = CATEGORII.find((c) => c.slug === categorySlug);
  const sector = SECTOARE.find((s) => s.slug === sectorSlug);

  const preloadedKey = categorySlug + '/' + sectorSlug;
  const preloaded = window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__[preloadedKey];
  const [listari, setListari] = useState(preloaded || []);
  const [loading, setLoading] = useState(!preloaded);
  const [doarVerificati, setDoarVerificati] = useState(false);

  useEffect(() => {
    if (!preloaded || doarVerificati) {
      setLoading(true);
      const params = new URLSearchParams({ category: categorySlug, sector: sectorSlug });
      if (doarVerificati) params.set('verified', 'true');
      fetch('/api/business?' + params)
        .then((r) => r.json())
        .then(setListari)
        .catch(() => setListari([]))
        .finally(() => setLoading(false));
    }
  }, [categorySlug, sectorSlug, doarVerificati, preloaded]);

  if (!categorie || !sector) {
    return (
      <div className="text-center py-16">
        <p className="text-primary text-lg font-semibold mb-3">Pagina nu a fost găsită.</p>
        <Link to="/" className="text-textLight underline hover:text-primary">Înapoi acasă</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">
          {categorie.nume} <span className="text-textLight font-normal">în</span> {sector.nume}
        </h1>
        <p className="text-textLight">
          Meseriași verificați în {sector.nume}.
        </p>
      </div>

      <label className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 shadow-sm cursor-pointer active:bg-gray-50">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
          checked={doarVerificati}
          onChange={(e) => setDoarVerificati(e.target.checked)}
        />
        <span className="text-sm font-medium text-text">Doar verificați</span>
      </label>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && listari.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-textLight mb-4">
            Nu avem meseriași pentru {categorie.nume.toLowerCase()} în {sector.nume}.
          </p>
          <Link to="/listeaza-te" className="btn-primary">
            Fii primul listat
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {listari.map((b) => (
          <Link key={b.id} to={'/profil/' + b.id} className="card block active:scale-[0.98]">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <h3 className="text-text truncate">{b.nume}</h3>
                  {b.is_verified && <span className="badge badge-verified">✓</span>}
                  {b.plan === 'elite' && <span className="badge badge-elite">Elite</span>}
                </div>
                <p className="text-textLight text-sm line-clamp-2">
                  {b.descriere || 'Profesionist cu experiență.'}
                </p>
              </div>
              {b.rating_mediu && (
                <div className="flex items-center gap-1 text-primary font-semibold text-sm flex-shrink-0">
                  <span>★</span>
                  <span>{b.rating_mediu}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
