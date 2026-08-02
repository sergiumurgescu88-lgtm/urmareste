import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="bg-glow" />
      
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-display font-bold text-white tracking-tight">
            urmărește<span className="text-primary">.</span>
          </Link>
          <Link to="/listeaza-te" className="btn-primary text-sm">
            Listează-te
          </Link>
        </div>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 md:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm">
        <p>&copy; {new Date().getFullYear()} urmărește.online</p>
      </footer>
    </div>
  );
}
