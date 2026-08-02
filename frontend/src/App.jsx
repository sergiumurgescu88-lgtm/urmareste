import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <div className="bg-blobs" />
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-display font-bold text-text tracking-tight">
            urmărește<span className="text-primary">.</span>
          </Link>
          <Link to="/listeaza-te" className="btn-primary">
            Listează-te
          </Link>
        </div>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-textLight text-sm">
        <p>&copy; {new Date().getFullYear()} urmărește.online</p>
      </footer>
    </div>
  );
}
