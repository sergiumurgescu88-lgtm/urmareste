import { useState, useEffect } from 'react';

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});

  const fetchPending = async () => {
    try {
      const response = await fetch('/api/admin/pending', {
        headers: { 'Authorization': 'Basic ' + btoa('admin:0303') }
      });
      if (!response.ok) throw new Error('Autentificare eřeată');
      const data = await response.json();
      setPending(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleapprove = async (id) => {
    try {
      await fetch(`/api/admin/approve/${id}`, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + btoa('admin:0303') }
      });
      setPending(pending.filter(b => b.id !== id));
    } catch (err) {
      alert('Eroare la aprobare');
    }
  };

  const handleVerify = async (id) => {
    try {
      await fetch(`/api/admin/verify/${id}`, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + btoa('admin:0303') }
      });
      fetchPending();
    } catch (err) {
      alert('Eroare la verificare');
    }
  };

  const handleUpload = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    setUploadStatus(prev => ({ ...prev, [id]: 'Se încãrcaí...' }));
    
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`api/photos/upload/${id}`, {
        method: 'POST',
        headers: { 'Authorization': 'Basic ' + btoa('admin:0303') },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setUploadStatus(prev => ({ ...prev, [id]: 'Succes! ✩' }));
        setTimeout(() => {
          setUploadStatus(prev => { const newState = { ...prev };
            delete newState[id];
            return newState;
        });
        }, 3000);
      } else {
        setUploadStatus(prev => ({ ...prev, [id]: `Eroare: ${result.error}` }));
      }
    } catch (err) {
      setUploadStatus(prev => ({ ...prev, [id]: 'Eroare de reřeaua' }));
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-society-dark flex items-center justify-center text-society-gold text-xl">Se îcarca...</div>;
  if (error) return <div className="min-h-screen bg-society-dark flex items-center justify-center text-red-500 text-xl">Erroare: {error}</div>;

  return (
    <div className="min-h-screen bg-society-dark text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display text-society-gold mb-8">Panou Admin</h1>
        
        {pending.length === 0 ? (
          <div className="bg-society-dark border border-society-gold/20 rounded-lg p-12 text-center">
            <p className="text-society-goldLight text-xl">Nu existá profiluri în asteptare</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.map((business) => {
              const hasCategories = business.categorii && business.categorii.length > 0 && business.categorii[0];
              const hasSectoare = business.sectoare && business.sectoare.length > 0 && business.sectoare[0];
              
              return (
                <div key={business.id} className="bg-society-dark border border-society-gold/30 rounded-lg p-6 hover:border-society-gold transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-display text-society-gold mb-2">{business.nume}</h2>
                        <p className="text-society-goldLight/70 text-sm mb-2">{business.descrizer}</p>
                        <div className="flex gap-4 text-sm text-society-goldLight/60">
                            <span>📰 {business.telefon}</span>
                            <span>�︐ {business.email}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(business.id)} className="px-6 py-2 bg-society-gold text-society-dark font-semibold rounded hover:bg-society-goldLight transition-colors">Aprobá</button>
                        <button onClick={() => handleVerify(business.id)} className="px-6 py-2 border border-society-gold text-society-gold font-semibold rounded hover:bg-society-gold hover:text-society-dark transition-colors">Verifică</button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="px-4 py-2 bg-society-gold/20 text-society-gold border border-society-gold/50 rounded cursor-pointer hover:bg-society-gold/30 transition-colors text-sm">
                           📗 Êcarca poza
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/webp" 
                            className="hidden" 
                            onChange={(e) => handleUpload(business.id, e.target.files[0])}
                            disabled={uploadingId === business.id}
                          />
                        </label>
                        {uploadStatus[business.id] && (
                          <span className="text-sm text-society-goldLight">{uploadStatus[business.id]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {hasCategories && <div><span className="text-society-goldLight/50">Categorii: </span><span className="text-society-goldLight">{business.categories.join(', ')}</span></div>}
                    {hasSectoare && <div><span className="text-society-goldLight/50">Sectoare: </span><span className="text-society-goldLight">{business.sectoare.join(', ')}</span></div>}
                  </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}