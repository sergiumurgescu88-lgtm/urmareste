import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const bizId = localStorage.getItem('business_id');
    if (!bizId) { navigate('/login'); return; }

    fetch('/api/business/' + bizId)
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setPhotos([{ url: '/uploads/1785619755008-308720615.png' }]);
        setReviews([
          { id: 1, client: 'Andreea M.', rating: 5, comment: 'Foarte profesioniști!', date: '10 Aug 2026' },
          { id: 2, client: 'Mihai S.', rating: 5, comment: 'Preț corect și muncă curată.', date: '15 Aug 2026' }
        ]);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('business_id');
    navigate('/');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('Se încarcă...');
    const formData = new FormData();
    formData.append('photo', file);
    const bizId = localStorage.getItem('business_id');
    
    try {
      const res = await fetch('/api/photos/upload/' + bizId, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + btoa('admin:0303') },
        body: formData
      });
      const result = await res.json();
      if (result.success) {
        setPhotos([...photos, { url: result.url }]);
        setUploadStatus('Succes! ✓');
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Eroare la upload.');
      }
    } catch (err) {
      setUploadStatus('Eroare de rețea.');
    }
  };

  if (!profile) return <div className="text-center py-20">Se încarcă...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-bold">Dashboard Meseriaș</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">Deconectare</button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['profil', 'portofoliu', 'recenzii'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm capitalize transition-all ${activeTab === tab ? 'bg-[#c8a96e] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[400px]">
        {activeTab === 'profil' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Informații Profil</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume Firmă</label>
                <input type="text" defaultValue={profile.nume} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="text" defaultValue={profile.telefon} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" readOnly />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descriere</label>
              <textarea defaultValue={profile.descriere} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" readOnly></textarea>
            </div>
            <button className="btn-primary">Salvează Modificările</button>
          </div>
        )}

        {activeTab === 'portofoliu' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Portofoliu Foto</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-6 hover:border-[#c8a96e] transition-colors">
              <label className="cursor-pointer">
                <span className="btn-secondary inline-block">Alege o imagine</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {uploadStatus && <p className="mt-3 text-sm text-[#c8a96e] font-medium">{uploadStatus}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={p.url} alt="Portofoliu" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recenzii' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Recenzii Primite ({reviews.length})</h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900">{r.client}</span>
                    <span className="text-[#c8a96e] font-bold">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{r.comment}</p>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
