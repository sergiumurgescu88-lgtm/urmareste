import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">urmărește<span style={{ color: '#e8c98e' }}>.</span></Link>
          <Link to="/listeaza-te" className="btn">Listează-te gratuit</Link>
        </div>
      </header>
      <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <Outlet />
      </main>
    </>
  );
}
