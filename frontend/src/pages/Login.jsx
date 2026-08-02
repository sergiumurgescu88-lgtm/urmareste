import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo: Orice telefon loghează business-ul cu ID 1
    localStorage.setItem('business_id', '1');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-display font-bold mb-2">Bine ai venit!</h2>
        <p className="text-gray-500 mb-8 text-sm">Autentifică-te pentru a-ți gestiona profilul.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Număr de telefon</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] outline-none transition-all"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Intră în cont
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-6">Demo: Apasă "Intră în cont" pentru a accesa dashboard-ul.</p>
      </div>
    </div>
  );
}
