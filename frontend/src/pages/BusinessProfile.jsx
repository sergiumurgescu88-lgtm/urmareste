import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BusinessProfile() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/business/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBusiness(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#c8a96e]"></div></div>;
  if (!business) return <div className="text-center py-20 text-gray-500">Profilul nu a fost găsit.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Profil */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#1a1a1a]">{business.nume}</h1>
              {business.is_verified && <span className="badge badge-verified">✓ Verificat</span>}
              {business.plan === 'elite' && <span className="badge badge-elite">Elite</span>}
              {business.plan === 'premium' && <span className="badge badge-premium">Premium</span>}
            </div>
            {business.rating_mediu && (
              <div className="flex items-center gap-2 text-[#c8a96e] font-bold text-lg">
                <span>★</span>
                <span>{business.rating_mediu}</span>
                <span className="text-gray-400 text-sm font-normal">({business.review_count || 0} recenzii)</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a href={`tel:${business.telefon}`} className="btn-primary flex items-center justify-center gap-2">
              <span>📞</span> Sună acum
            </a>
            {business.whatsapp && (
              <a href={`https://wa.me/${business.whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center justify-center gap-2">
                <span>💬</span> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-lg mb-2">Despre noi</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{business.descriere || 'Nu există o descriere disponibilă.'}</p>
        </div>
        
        {business.adresa && (
          <div className="border-t border-gray-100 pt-4 mt-4 flex items-center gap-2 text-gray-600">
            <span>📍</span>
            <span>{business.adresa}</span>
          </div>
        )}
      </div>

      {/* Galerie Foto (Mock pentru demo, va fi dinamic când se adaugă poze) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Portofoliu Foto</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
            <span className="text-sm">Poze portofoliu</span>
          </div>
          {/* Aici se vor mapa pozele reale din business.photos când sunt disponibile */}
        </div>
      </div>

      {/* Recenzii */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4">Recenzii Clienți</h3>
        <div className="space-y-4">
          {business.reviews && business.reviews.length > 0 ? (
            business.reviews.map((review, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{review.client_name || 'Client Anonim'}</span>
                  <span className="text-[#c8a96e] font-bold">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {new Date(review.creat_la).toLocaleDateString('ro-RO')}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Încă nu există recenzii pentru acest profil.</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Link to="/" className="text-gray-500 hover:text-[#c8a96e] text-sm underline">← Înapoi la căutare</Link>
      </div>
    </div>
  );
}
