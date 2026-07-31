import { TELEFONO_ADMIN, PIN_ADMIN } from '../../lib/supabase';

export default function MenuView({ usuario, setStep, onLogout }) {
  const handleAdminClick = () => {
    const pinIngresado = prompt("Ingresa la clave de Administrador/Barbero:");
    if (pinIngresado === PIN_ADMIN) {
      setStep('admin');
    } else if (pinIngresado !== null) {
      alert("Clave incorrecta. Acceso denegado.");
    }
  };

  return (
    <div className="bg-[#141619] border border-zinc-800 p-6 rounded-2xl shadow-2xl gold-border-glow">
      <h2 className="text-lg font-bold text-center text-zinc-100 tracking-wider">
        PANEL DE CLIENTE
      </h2>
      <p className="text-center text-zinc-400 text-xs mb-6">¿Qué deseas hacer hoy?</p>

      <div className="space-y-3">
        <button
          onClick={() => setStep('services')}
          className="w-full py-3.5 gold-button rounded-xl uppercase text-xs tracking-widest"
        >
          📅 Agendar Nueva Cita
        </button>

        <button
          onClick={() => setStep('history')}
          className="w-full py-3.5 bg-[#0b0c0e] border border-zinc-800 hover:border-[#d4af37] text-zinc-300 hover:text-[#d4af37] rounded-xl text-xs font-semibold uppercase tracking-wider transition"
        >
          📋 Historial de Citas
        </button>

        {usuario?.telefono === TELEFONO_ADMIN && (
          <button
            onClick={handleAdminClick}
            className="w-full py-3.5 border border-[#d4af37]/60 bg-[#d4af37]/5 text-[#d4af37] hover:bg-[#d4af37]/20 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
          >
            💈 Panel Administrador (Barbero)
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full py-3 text-zinc-500 hover:text-red-400 text-xs uppercase tracking-wider transition mt-4"
        >
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
}