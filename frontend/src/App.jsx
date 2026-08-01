import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen relative">
      {/* Fundal animat antigravitațional */}
      <div className="bg-aurora" />
      
      <header className="sticky top-0 z-50 bg-society-dark/80 backdrop-blur-md border-b border-society-gold/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            urmărește<span className="text-society-gold">.</span>
          </Link>
          <Link 
            to="/listeaza-te" 
            className="px-5 py-2.5 bg-society-gold text-society-dark font-semibold rounded-lg text-sm md:text-base hover:bg-society-goldLight transition-all duration-300 shadow-lg shadow-society-gold/20 active:scale-95"
          >
            Listează-te gratuit
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:py-12 relative z-10">
        <Outlet />
      </main>

      <footer className="border-t border-society-gold/10 py-8 mt-12 text-center text-society-gold/40 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} urmărește.online. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}
