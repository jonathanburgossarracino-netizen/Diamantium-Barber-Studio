import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const HORARIOS = [
  "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"
];

export default function DateTimeView({ usuario, servicioData, onConfirm, onBack }) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!fecha) return;

    const checkDisponibilidad = async () => {
      const { data } = await supabase
        .from('citas')
        .select('hora_cita')
        .eq('fecha_cita', fecha);

      if (data) {
        setHorasOcupadas(data.map(c => c.hora_cita));
      }
    };

    checkDisponibilidad();
    setHora('');
  }, [fecha]);

  const handleFinish = async () => {
    if (!fecha || !hora) return alert('Por favor selecciona una fecha y hora disponible.');

    const nuevaCita = {
      cliente_nombre: usuario.nombre,
      cliente_telefono: usuario.telefono,
      servicio: servicioData.servicio,
      precio: servicioData.precio,
      descripcion: servicioData.descripcion,
      fecha_cita: fecha,
      hora_cita: hora
    };

    const { error } = await supabase.from('citas').insert([nuevaCita]);

    if (error) return alert('Error al guardar la cita en Supabase.');

    alert(`¡Cita Confirmada!\n\nServicio: ${nuevaCita.servicio}\nFecha: ${fecha} a las ${hora}`);
    onConfirm();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-center mb-4 text-zinc-100">Selecciona Fecha y Hora</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Día de tu cita</label>
          <input
            type="date"
            min={hoy}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1">Horarios disponibles</label>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-400 outline-none"
          >
            <option value="">-- Selecciona una hora --</option>
            {HORARIOS.map((h) => {
              const ocupado = horasOcupadas.includes(h);
              return (
                <option key={h} value={h} disabled={ocupado}>
                  {h} {ocupado ? '🚫 (OCUPADO)' : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <button
        onClick={handleFinish}
        className="w-full py-3 bg-amber-400 hover:bg-amber-500 font-bold text-black rounded-lg transition mt-6"
      >
        Confirmar Reserva
      </button>
      <button
        onClick={onBack}
        className="w-full py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition mt-2 text-sm"
      >
        Atrás
      </button>
    </div>
  );
}