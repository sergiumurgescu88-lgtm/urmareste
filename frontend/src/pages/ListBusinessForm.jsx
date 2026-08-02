import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListBusinessForm() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, plan: 'free', is_verified: false, activ: true })
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-display font-bold mb-2">Solicitare trimisă!</h2>
          <p className="text-gray-500 mb-6">Profilul tău este în curs de verificare. Te vom contacta în curând.</p>
          <p className="text-sm text-gray-400">Vei fi redirecționat automat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2 text-center">Listează-ți afacerea</h1>
        <p className="text-gray-500 text-center mb-8">Completează formularul pentru a apărea în căutările clienților din zona ta. Este 100% gratuit.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume Firmă / Meseriaș *</label>
              <input name="nume" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all" placeholder="Ex: Instalații Popescu SRL" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
              <input name="telefon" required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all" placeholder="07xx xxx xxx" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all" placeholder="contact@exemplu.ro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresă / Zonă de acoperire</label>
              <input name="adresa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all" placeholder="Ex: București, Sector 3" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descriere servicii *</label>
            <textarea name="descriere" required rows="4" maxLength="500" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all" placeholder="Descrie pe scurt experiența și serviciile oferite..."></textarea>
            <p className="text-xs text-gray-400 mt-1 text-right">Maxim 500 caractere</p>
          </div>

          {status === 'error' && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">
              A apărut o eroare la trimitere. Te rugăm să încerci din nou.
            </div>
          )}

          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2">
            {status === 'loading' ? 'Se trimite...' : 'Trimite solicitarea gratuit'}
          </button>
        </form>
      </div>
    </div>
  );
}
