import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORII } from '../data/categories.js';
import { SECTOARE } from '../data/sectors.js';
import AdBanner from '../components/AdBanner.jsx';

export default function CategorySector() {
  const { categorySlug, sectorSlug } = useParams();
  
  const categorie = CATEGORII.find((c) => c.slug === categorySlug);
  const sector = SECTOARE.find((s) => s.slug === sectorSlug);

  const preloaded = window.__PRELOADED_STATE__?.[`${categorySlug}/${sectorSlug}`];
  
  const [listari, setListari] = useState(preloaded || []);
  const [loading, setLoading] = useState(!preloaded);
  const [doarVerificati, setDoarVerificati] = useState(false);

  useEffect(() => {
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
    return (
      <div className="text-center py-20">
        <p className="text-society-gold text-xl">Pagina nu a fost găsită.</p>
        <Link to="/" className="text-society-goldLight underline mt-4 inline-block">Înapoi acasă</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-display text-society-gold mb-3 leading-tight">
          {categorie.nume} <span className="text-white/40">în</span> {sector.nume}
        </h1>
        <p className="text-society-goldLight/70 text-base md:text-lg leading-relaxed">
          Meseriași verificați și disponibili în {sector.nume}, {sector.tip === 'ilfov' ? 'județul Ilfov' : 'București'}. 
          Găsește rapid profesioniști de încredere.
        </p>
      </div>

      {/* Filtru */}
      <label className="inline-flex items-center gap-3 mb-8 p-3 rounded-lg bg-society-gold/5 border border-society-gold/10 cursor-pointer hover:bg-society-gold/10 transition-colors">
        <input
          type="checkbox"
          className="w-5 h-5 rounded border-society-gold/30 text-society-gold focus:ring-society-gold/50 bg-society-dark"
          checked={doarVerificati}
          onChange={(e) => setDoarVerificati(e.target.checked)}
        />
        <span className="text-sm md:text-base font-medium text-society-goldLight">Doar meseriași verificați</span>
      </label>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-society-gold"></div>
        </div>
      )}

      {!loading && listari.length === 0 && (
        <div className="bg-society-gold/5 border border-society-gold/20 rounded-xl p-8 text-center">
          <p className="text-society-goldLight mb-6 text-lg">
            Încă nu avem meseriași listați pentru <span className="text-society-gold font-semibold">{categorie.nume.toLowerCase()}</span> în <span className="text-society-gold font-semibold">{sector.nume}</span>.
          </p>
          <Link to="/listeaza-te" className="inline-block px-8 py-3 bg-society-gold text-society-dark font-bold rounded-lg hover:bg-society-goldLight transition-all shadow-lg shadow-society-gold/20 active:scale-95">
            Fii primul listat aici
          </Link>
        </div>
      )}

      {/* Listă carduri */}
      <div className="space-y-4 md:space-y-6">
        {listari.map((b, index) => (
          <div key={b.id}>
            <Link to={`/profil/${b.id}`} className="block group bg-society-dark/50 backdrop-blur-sm border border-society-gold/20 rounded-xl p-5 md:p-6 hover:border-society-gold/60 hover:bg-society-gold/5 transition-all duration-300 active:scale-[0.98]">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-society-gold transition-colors">
                      {b.nume}
                    </h3>
                    {b.is_verified && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">Verificat</span>}
                    {b.plan === 'elite' && <span className="px-2 py-0.5 bg-society-gold/20 text-society-gold text-xs font-semibold rounded-full border border-society-gold/30">Elite</span>}
                    {b.plan === 'premium' && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full border border-purple-500/30">Premium</span>}
                  </div>
                  <p className="text-society-goldLight/60 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                    {b.descriere || 'Profesionist cu experiență, gata să îți rezolve problema rapid și eficient.'}
                  </p>
                </div>
                {b.rating_mediu && (
                  <div className="flex items-center gap-1.5 text-society-gold font-bold text-lg md:self-center md:self-start">
                    <span>★</span>
                    <span>{b.rating_mediu}</span>
                  </div>
                )}
              </div>
            </Link>

            {/* Reclamă subtilă după fiecare al 3-lea card */}
            {(index + 1) % 3 === 0 && <AdBanner />}
          </div>
        ))}
      </div>
    </div>
  );
}
