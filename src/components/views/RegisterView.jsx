import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function RegisterView({ onLoginSuccess }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [pin, setPin] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telefono.length !== 10) return alert('Ingresa un teléfono válido a 10 dígitos.');
    if (pin.length !== 4) return alert('El PIN debe ser de 4 dígitos.');

    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('*')
      .eq('telefono', telefono)
      .maybeSingle();

    if (usuarioExistente) {
      if (usuarioExistente.pin !== pin) return alert('PIN incorrecto. Verifica tus datos.');
      onLoginSuccess({ nombre: usuarioExistente.nombre, telefono: usuarioExistente.telefono });
    } else {
      const { error } = await supabase
        .from('usuarios')
        .insert([{ nombre, telefono, pin }]);

      if (error) return alert('Hubo un error al guardar el usuario.');
      onLoginSuccess({ nombre, telefono });
    }
  };

  return (
    <div className="bg-[#141619] border border-zinc-800 p-6 rounded-2xl shadow-2xl gold-border-glow">
      <h2 className="text-lg font-bold text-center mb-6 text-zinc-100 tracking-wider">
        CREAR CUENTA / ACCESO
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="w-full px-4 py-3 bg-[#0b0c0e] border border-zinc-800 rounded-xl text-white text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            WhatsApp (10 dígitos)
          </label>
          <input
            type="tel"
            maxLength={10}
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 1234567890"
            className="w-full px-4 py-3 bg-[#0b0c0e] border border-zinc-800 rounded-xl text-white text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            PIN de acceso (4 dígitos)
          </label>
          <input
            type="password"
            maxLength={4}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            className="w-full px-4 py-3 bg-[#0b0c0e] border border-zinc-800 rounded-xl text-white text-sm focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 gold-button rounded-xl uppercase text-xs tracking-widest mt-2"
        >
          Ingresar / Registrarme
        </button>
      </form>
    </div>
  );
}