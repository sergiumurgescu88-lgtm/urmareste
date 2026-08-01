import { useState } from 'react';
import { CATEGORII } from '../data/categories.js';
import { SECTOARE } from '../data/sectors.js';

export default function ListBusinessForm() {
  const [form, setForm] = useState({
    nume: '', descriere: '', ani_experienta: '', program: '',
    telefon: '', whatsapp: '', email: '', adresa: '',
    category_ids: [], sector_ids: [],
    are_autorizatie: false,
  });
  const [trimis, setTrimis] = useState(false);

  const toggle = (field, value) => {
    setForm((f) => {
      const set = new Set(f[field]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...f, [field]: [...set] };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setTrimis(true);
  };

  if (trimis) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: 480, margin: '48px auto' }}>
        <h2>Profilul tău a fost trimis</h2>
        <p>Îl publicăm gratuit după o verificare rapidă. Dacă vrei badge-ul "Verificat" mai târziu, îți cerem doar atunci autorizația.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="display" style={{ fontSize: 26 }}>Listează-te gratuit</h1>
      <p style={{ color: 'var(--text-dim)' }}>Durează 2 minute. Fără card, fără obligații.</p>

      <label>Nume afacere / meseriaș *</label>
      <input required value={form.nume} onChange={(e) => setForm({ ...form, nume: e.target.value })} />

      <label>Descriere (max 500 caractere)</label>
      <textarea rows={4} maxLength={500} value={form.descriere} onChange={(e) => setForm({ ...form, descriere: e.target.value })} />

      <div className="grid grid-2">
        <div>
          <label>Ani de experiență</label>
          <select value={form.ani_experienta} onChange={(e) => setForm({ ...form, ani_experienta: e.target.value })}>
            <option value="">Alege</option>
            <option value="1-3">1-3 ani</option>
            <option value="3-5">3-5 ani</option>
            <option value="5+">5+ ani</option>
          </select>
        </div>
        <div>
          <label>Telefon *</label>
          <input required value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} />
        </div>
      </div>

      <label>Program de lucru</label>
      <input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="Ex: Luni-Vineri 8-18" />

      <label>Categorii de servicii * (selectează una sau mai multe)</label>
      <div className="grid grid-2" style={{ marginTop: 8 }}>
        {CATEGORII.map((c) => (
          <label key={c.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginTop: 0 }}>
            <input type="checkbox" style={{ width: 'auto' }} onChange={() => toggle('category_ids', c.slug)} />
            {c.nume}
          </label>
        ))}
      </div>

      <label>Zone unde lucrezi * (selectează una sau mai multe)</label>
      <div className="grid grid-3" style={{ marginTop: 8 }}>
        {SECTOARE.map((s) => (
          <label key={s.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginTop: 0 }}>
            <input type="checkbox" style={{ width: 'auto' }} onChange={() => toggle('sector_ids', s.slug)} />
            {s.nume}
          </label>
        ))}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          style={{ width: 'auto' }}
          checked={form.are_autorizatie}
          onChange={(e) => setForm({ ...form, are_autorizatie: e.target.checked })}
        />
        Am autorizație ANRE/ISCIR (opțional — poți adăuga și mai târziu pentru badge-ul "Verificat")
      </label>

      <button type="submit" className="btn" style={{ marginTop: 24, width: '100%' }}>Trimite profilul</button>
    </form>
  );
}
