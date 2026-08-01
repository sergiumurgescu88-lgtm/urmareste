import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BusinessProfile() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({ client_nume: '', client_telefon: '', mesaj: '' });
  const [trimis, setTrimis] = useState(false);

  useEffect(() => {
    fetch(`/api/business/${id}`).then((r) => r.json()).then(setBusiness);
  }, [id]);

  const trimiteCerere = async (e) => {
    e.preventDefault();
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: id, ...form }),
    });
    setTrimis(true);
  };

  if (!business) return <p>Se încarcă...</p>;

  return (
    <div className="grid grid-2" style={{ alignItems: 'start' }}>
      <div>
        <h1 className="display" style={{ fontSize: 28 }}>
          {business.nume}
          {business.is_verified && <span className="badge badge-verified" style={{ marginLeft: 10 }}>Verificat</span>}
        </h1>
        <p style={{ color: 'var(--text-dim)', margin: '12px 0' }}>{business.descriere}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '16px 0' }}>
          {business.categories?.map((c) => (
            <span key={c.slug} className="badge badge-premium">{c.nume}</span>
          ))}
        </div>

        {business.ani_experienta && <p><strong>Experiență:</strong> {business.ani_experienta} ani</p>}
        {business.program && <p><strong>Program:</strong> {business.program}</p>}

        {business.reviews?.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3>Recenzii</h3>
            {business.reviews.map((r, i) => (
              <div key={i} className="card" style={{ marginBottom: 10 }}>
                <div style={{ color: 'var(--gold-light)' }}>{'★'.repeat(r.rating)}</div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Trimite o cerere</h3>
        {trimis ? (
          <p>Cererea a fost trimisă. {business.nume} te va contacta direct.</p>
        ) : (
          <form onSubmit={trimiteCerere}>
            <label>Numele tău *</label>
            <input required value={form.client_nume} onChange={(e) => setForm({ ...form, client_nume: e.target.value })} />
            <label>Telefon *</label>
            <input required value={form.client_telefon} onChange={(e) => setForm({ ...form, client_telefon: e.target.value })} />
            <label>Mesaj</label>
            <textarea rows={4} value={form.mesaj} onChange={(e) => setForm({ ...form, mesaj: e.target.value })} />
            <button type="submit" className="btn" style={{ marginTop: 16, width: '100%' }}>Trimite cererea</button>
          </form>
        )}
      </div>
    </div>
  );
}
