import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CATEGORII } from '../data/categories.js';
import { SECTOARE } from '../data/sectors.js';

export default function Home() {
  const [categorie, setCategorie] = useState('');
  const [sector, setSector] = useState('');
  const navigate = useNavigate();

  const cauta = (e) => {
    e.preventDefault();
    if (categorie && sector) navigate(`/${categorie}/${sector}`);
  };

  return (
    <>
      <section style={{ textAlign: 'center', padding: '48px 0' }}>
        <h1 className="display" style={{ fontSize: 40, marginBottom: 12 }}>
          Meseriași verificați în București
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 16, maxWidth: 520, margin: '0 auto 32px' }}>
          Fără AI, fără roboți — oameni reali care fac treabă reală. Găsești în minute cine îți repară, montează sau curăță.
        </p>

        <form onSubmit={cauta} className="card grid grid-2" style={{ maxWidth: 620, margin: '0 auto', textAlign: 'left' }}>
          <div>
            <label>Ce cauți?</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              <option value="">Alege o categorie</option>
              {CATEGORII.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nume}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Unde?</label>
            <select value={sector} onChange={(e) => setSector(e.target.value)}>
              <option value="">Alege zona</option>
              {SECTOARE.map((s) => (
                <option key={s.slug} value={s.slug}>{s.nume}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn" style={{ gridColumn: '1 / -1', marginTop: 12 }}>Caută meseriași</button>
        </form>
      </section>

      <section>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Categorii</h2>
        <div className="grid grid-3">
          {CATEGORII.map((c) => (
            <Link key={c.slug} to={`/${c.slug}/sector-1`} className="card">
              <div style={{ fontWeight: 600 }}>{c.nume}</div>
              {c.autorizatie && (
                <span className="badge badge-verified" style={{ marginTop: 8 }}>Autorizație {c.autorizatie}</span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
