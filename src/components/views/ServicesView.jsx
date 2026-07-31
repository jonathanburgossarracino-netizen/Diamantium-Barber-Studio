import { useState } from 'react';

const SERVICIOS = [
  { id: '1', nombre: 'Corte Tradicional / Degradado', valor: 'Corte de Cabello', precio: 180 },
  { id: '2', nombre: ' Perfilado de Barba', valor: 'Arreglo de Barba', precio: 120 },
  { id: '3', nombre: 'Combo Diamantium (Corte + Barba)', valor: 'Combo Completo', precio: 300 },
];

export default function ServicesView({ onNext, onBack }) {
  const [servicioSel, setServicioSel] = useState(SERVICIOS[0]);
  const [descripcion, setDescripcion] = useState('');

  const handleContinue = () => {
    onNext({
      servicio: servicioSel.valor,
      precio: servicioSel.precio,
      descripcion: descripcion.trim() || 'Sin detalles especificados'
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold text-center mb-4 text-zinc-100">Selecciona un Servicio</h2>

      <div className="space-y-3">
        {SERVICIOS.map((item) => (
          <label
            key={item.id}
            className={`flex items-center p-4 rounded-lg border cursor-pointer transition ${
              servicioSel.id === item.id ? 'border-amber-400 bg-amber-400/10' : 'border-zinc-800 bg-zinc-800/50'
            }`}
          >
            <input
              type="radio"
              name="servicio"
              checked={servicioSel.id === item.id}
              onChange={() => setServicioSel(item)}
              className="accent-amber-400 w-4 h-4 mr-3"
            />
            <div>
              <p className="font-bold text-sm text-zinc-100">{item.nombre}</p>
              <p className="text-amber-400 font-semibold text-xs mt-0.5">${item.precio} MXN</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-xs text-zinc-400 mb-1">¿Cómo deseas tu corte? (Opcional)</label>
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej. Fade medio en cero, marcar patillas rectas..."
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-amber-400 outline-none resize-none"
        />
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 bg-amber-400 hover:bg-amber-500 font-bold text-black rounded-lg transition mt-4"
      >
        Continuar a Fecha y Hora
      </button>
      <button
        onClick={onBack}
        className="w-full py-2.5 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition mt-2 text-sm"
      >
        Volver al Menú
      </button>
    </div>
  );
}