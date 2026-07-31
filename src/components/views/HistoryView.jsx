import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function HistoryView({ usuario, onBack }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      const { data } = await supabase
        .from('citas')
        .select('*')
        .eq('cliente_telefono', usuario.telefono);

      if (data) setCitas(data);
      setLoading(false);
    };

    fetchCitas();
  }, [usuario]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-center mb-4 text-zinc-100">Mis Citas Agendadas</h2>

      {loading ? (
        <p className="text-center text-zinc-500 py-4">Cargando citas...</p>
      ) : citas.length === 0 ? (
        <p className="text-center text-zinc-500 py-4">No tienes citas agendadas.</p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {citas.map((c) => (
            <div key={c.id} className="p-3.5 bg-zinc-800/60 border border-zinc-700 border-l-4 border-l-amber-400 rounded-r-lg">
              <h4 className="font-bold text-amber-400 text-sm">{c.servicio}</h4>
              <p className="text-xs text-zinc-300 mt-1">📅 <strong>Fecha:</strong> {c.fecha_cita} - {c.hora_cita}</p>
              <p className="text-xs text-zinc-400 mt-0.5">📝 <strong>Detalles:</strong> {c.descripcion}</p>
              <p className="text-xs text-amber-400 font-semibold mt-1">💵 ${c.precio} MXN</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition mt-4 text-sm"
      >
        Volver al Menú
      </button>
    </div>
  );
}