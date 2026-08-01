export default function AdBanner({ className = "" }) {
  return (
    <div className={`w-full my-6 md:my-10 p-4 md:p-6 border border-society-gold/10 bg-society-gold/5 rounded-xl backdrop-blur-sm ${className}`}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-society-gold/40 mb-3 block text-center">
        Sponsorizat
      </span>
      <div className="min-h-[100px] md:min-h-[120px] flex flex-col items-center justify-center text-society-gold/30 text-sm md:text-base rounded-lg border border-dashed border-society-gold/20">
        {/* Înlocuiește acest div cu codul real Google AdSense când îl ai */}
        <span className="font-light">Spațiu Publicitar (Google Ads)</span>
        <span className="text-xs mt-1 opacity-50">Se încarcă discret...</span>
      </div>
    </div>
  );
}
