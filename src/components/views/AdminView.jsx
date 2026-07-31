import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminView({ onBack }) {
  const [citas, setCitas] = useState([]);
  const [stats, setStats] = useState({ cantidad: 0, ingresos: 0 });

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data } = await supabase.from('citas').select('*');
      if (data) {
        setCitas(data);

        const mesActual = new Date().toISOString().slice(0, 7);
        const delMes = data.filter(c => c.fecha_cita && c.fecha_cita.startsWith(mesActual));
        const ganancias = delMes.reduce((sum, c) => sum + (c.precio || 0), 0);

        setStats({ cantidad: delMes.length, ingresos: ganancias });
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-center mb-4 text-zinc-100">💈 Agenda y Finanzas</h2>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 bg-zinc-950 border border-amber-400/50 rounded-lg text-center">
          <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Citas del Mes</span>
          <span className="block text-lg font-bold text-amber-400 mt-1">{stats.cantidad}</span>
        </div>
        <div className="p-3 bg-zinc-950 border border-amber-400/50 rounded-lg text-center">
          <span className="block text-[10px] text-zinc-400 uppercase tracking-wide">Ingresos del Mes</span>
          <span className="block text-lg font-bold text-amber-400 mt-1">${stats.ingresos} MXN</span>
        </div>
      </div>

      <h3 className="text-amber-400 font-semibold text-xs mb-3">Citas Agendadas en el Sistema:</h3>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {citas.length === 0 ? (
          <p className="text-center text-zinc-500 py-4">No hay ninguna cita en el sistema.</p>
        ) : (
          citas.map((c) => (
            <div key={c.id} className="p-3.5 bg-zinc-800/60 border border-zinc-700 border-l-4 border-l-amber-400 rounded-r-lg">
              <h4 className="font-bold text-amber-400 text-sm">{c.servicio} - ${c.precio} MXN</h4>
              <p className="text-xs text-zinc-300 mt-1">👤 <strong>Cliente:</strong> {c.cliente_nombre} ({c.cliente_telefono})</p>
              <p className="text-xs text-zinc-300 mt-0.5">📅 <strong>Agenda:</strong> {c.fecha_cita} @ {c.hora_cita}</p>
              <p className="text-xs text-zinc-400 mt-0.5">✂️ <strong>Corte:</strong> {c.descripcion}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onBack}
        className="w-full py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition mt-5 text-sm"
      >
        Volver al Menú
      </button>
    </div>
  );
}