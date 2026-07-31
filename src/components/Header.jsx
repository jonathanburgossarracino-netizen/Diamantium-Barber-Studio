export default function Header({ subtitle }) {
  return (
    <header className="text-center mb-8">
      <div className="relative inline-block mb-3">
        {/* Anillo exterior dorado con resplandor */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600 opacity-75 blur-sm"></div>
        <img
          src="/assets/logo.jpg"
          alt="Diamantium Barber Studio Logo"
          className="relative w-28 h-28 rounded-full object-cover border-2 border-[#d4af37] shadow-2xl mx-auto"
        />
      </div>
      <h1 className="text-2xl tracking-wide font-black uppercase gold-gradient-text">
        Diamantium Barber Studio
      </h1>
      <p className="text-zinc-400 text-xs tracking-widest uppercase mt-1">
        {subtitle}
      </p>
    </header>
  );
}