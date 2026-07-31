import { useState } from 'react';
import Header from './components/Header';
import RegisterView from './components/views/RegisterView';
import MenuView from './components/views/MenuView';
import ServicesView from './components/views/ServicesView';
import DateTimeView from './components/views/DateTimeView';
import HistoryView from './components/views/HistoryView';
import AdminView from './components/views/AdminView';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [step, setStep] = useState('register');
  const [servicioData, setServicioData] = useState(null);

  const handleLoginSuccess = (user) => {
    setUsuarioActual(user);
    setStep('menu');
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    setServicioData(null);
    setStep('register');
  };

  const subtitle = usuarioActual ? `¡Bienvenido, ${usuarioActual.nombre}!` : 'Reserva tu cita en segundos';

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-white flex flex-col justify-center items-center p-4">
      <main className="w-full max-w-sm">
        <Header subtitle={subtitle} />

        {step === 'register' && <RegisterView onLoginSuccess={handleLoginSuccess} />}
        {step === 'menu' && <MenuView usuario={usuarioActual} setStep={setStep} onLogout={handleLogout} />}
        {step === 'services' && (
          <ServicesView
            onNext={(data) => {
              setServicioData(data);
              setStep('datetime');
            }}
            onBack={() => setStep('menu')}
          />
        )}
        {step === 'datetime' && (
          <DateTimeView
            usuario={usuarioActual}
            servicioData={servicioData}
            onConfirm={() => setStep('menu')}
            onBack={() => setStep('services')}
          />
        )}
        {step === 'history' && <HistoryView usuario={usuarioActual} onBack={() => setStep('menu')} />}
        {step === 'admin' && <AdminView onBack={() => setStep('menu')} />}
      </main>
    </div>
  );
}