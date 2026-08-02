import { Link } from 'react-router-dom';
import { CATEGORII } from '../data/categories.js';

const CATEGORY_ICONS = {
  'instalatori': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
  'centrale-gaz': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  'electricieni': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  'curatenie': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  'zugravi': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  'aer-conditionat': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>,
  'gradina': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  'dezinsectie-mutari': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>,
  'tamplari': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.14c-.85 0-1.65-.33-2.25-.93L12.64 4.64"/></svg>,
  'reparatii-electrocasnice': <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
};

const DEFAULT_ICON = <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;

export default function Home() {
  const steps = [
    { num: '1', title: 'Caută', desc: 'Alege categoria și sectorul tău.' },
    { num: '2', title: 'Compară', desc: 'Vezi profiluri, recenzii și portofolii.' },
    { num: '3', title: 'Contactează', desc: 'Sună direct sau cere o ofertă.' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <div className="text-center py-10 md:py-20">
        <h1 className="mb-4">
          Găsește rapid <span className="text-[#c8a96e]">meseriași verificați</span>
        </h1>
        <p className="text-[#4b5563] text-lg mb-8 max-w-xl mx-auto">
          Platforma care conectează clienții din București și Ilfov cu profesioniști de încredere, evaluați prin recenzii reale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto px-4">
          <Link to="/electricieni/sector-3" className="btn-primary w-full sm:w-auto">
            Caută un meseriaș
          </Link>
          <Link to="/listeaza-te" className="btn-secondary w-full sm:w-auto">
            Sunt meseriaș
          </Link>
        </div>
      </div>

      {/* CUM FUNCȚIONEAZĂ */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        <h2 className="text-center mb-10">Cum funcționează?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-[#c8a96e]/10 text-[#c8a96e] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="mb-2">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORII POPULARE */}
      <div>
        <h2 className="text-center mb-8">Categorii populare</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORII.map((cat) => (
            <Link key={cat.slug} to={`/${cat.slug}/sector-3`} className="card flex flex-col items-center justify-center p-6 text-center hover:border-[#c8a96e]/50 group">
              <div className="text-[#c8a96e] mb-3 group-hover:scale-110 transition-transform duration-300">
                {CATEGORY_ICONS[cat.slug] || DEFAULT_ICON}
              </div>
              <div className="font-semibold text-[#1a1a1a] text-sm">{cat.nume.split(' ')[0]}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* WHY US / TRUST */}
      <div className="bg-[#1a1a1a] text-white rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-white mb-4">De ce să ai încredere în noi?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Fiecare meseriaș este verificat. Recenziile sunt reale și bidirecționale, asigurând transparență totală pentru ambele părți.
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="text-white text-lg mb-2">Profiluri Verificate</h3>
            <p className="text-gray-400 text-sm">Verificăm autorizațiile și identitatea fiecărui prestator.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-3">⭐</div>
            <h3 className="text-white text-lg mb-2">Recenzii Reale</h3>
            <p className="text-gray-400 text-sm">Doar clienții care au avut o interacțiune pot lăsa review.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-2xl mb-3">📸</div>
            <h3 className="text-white text-lg mb-2">Portofolii Foto</h3>
            <p className="text-gray-400 text-sm">Vezi lucrările anterioare înainte să iei o decizie.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
