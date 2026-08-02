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
      <div className="text-center py-20">
        <p className="text-primary text-xl">Pagina nu a fost găsită.</p>
        <Link to="/" className="text-primaryLight underline mt-4 inline-block">Înapoi acasă</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
          {categorie.nume} <span className="text-white/40">în</span> {sector.nume}
        </h1>
        <p className="text-white/60 text-base md:text-lg leading-relaxed">
          Meseriași verificați și disponibili în {sector.nume}. Găsește rapid profesioniști de încredere.
        </p>
      </div>

      <label className="inline-flex items-center gap-3 mb-8 p-3 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer active:bg-primary/10">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary/50 bg-bg"
          checked={doarVerificati}
          onChange={(e) => setDoarVerificati(e.target.checked)}
        />
        <span className="text-sm md:text-base font-medium text-white/90">Doar meseriași verificați</span>
      </label>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {!loading && listari.length === 0 && (
        <div className="card text-center py-10">
          <p className="text-white/80 mb-6 text-lg">
            Încă nu avem meseriași listați pentru <span className="text-primary font-semibold">{categorie.nume.toLowerCase()}</span> în <span className="text-primary font-semibold">{sector.nume}</span>.
          </p>
          <Link to="/listeaza-te" className="btn-primary">
            Fii primul listat aici
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {listari.map((b) => (
          <Link key={b.id} to={'/profil/' + b.id} className="card block">
            <div className="flex flex-col gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-lg md:text-xl font-bold text-white">{b.nume}</h3>
                  {b.is_verified && (
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/20">Verificat</span>
                  )}
                  {b.plan === 'elite' && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">Elite</span>
                  )}
                </div>
                <p className="text-white/60 text-sm line-clamp-2">
                  {b.descriere || 'Profesionist cu experiență, gata să îți rezolve problema rapid.'}
                </p>
              </div>
              {b.rating_mediu && (
                <div className="flex items-center gap-1.5 text-primary font-bold text-lg self-start md:self-center">
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
