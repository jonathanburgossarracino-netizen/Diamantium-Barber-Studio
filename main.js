// Conexión con Supabase
const SUPABASE_URL = 'https://rtdifbjwlrjorocrarro.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Dl8WO0tcPPpLqfu72b2-QQ_sKrnOw-4';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let usuarioActual = null;
let servicioTemp = {}; // <--- Esta es la variable

// 📱 CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP DE ADMINISTRADOR (10 DÍGITOS)
const TELEFONO_ADMIN = "9381370804"; 
const PIN_ADMIN = "1234";

function mostrarSeccion(idSeccion) {
    const secciones = ['step-register', 'step-menu', 'step-services', 'step-datetime', 'step-history', 'step-admin'];
    secciones.forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(idSeccion).classList.remove('hidden');
}

// Obtener todas las citas directamente desde Supabase
async function obtenerTodasLasCitas() {
  const { data, error } = await supabaseClient
    .from('citas')
    .select('*');

  if (error) {
    console.error('Error al cargar citas de Supabase:', error.message);
    return [];
  }
  return data || [];
}

// 1. Registro / Login
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    if (telefono.length !== 10) {
        alert('Ingresa un teléfono válido a 10 dígitos.');
        return;
    }
    
    if (pin.length !== 4) {
        alert('El PIN debe ser de 4 dígitos.');
        return;
    }
    usuarioActual = { nombre, telefono };
    document.getElementById('subtitulo').innerText = `¡Hola, ${nombre}!`;
    
    // Control de acceso de administrador
    const btnAdmin = document.getElementById('btn-menu-admin');
    if (telefono === TELEFONO_ADMIN) {
        btnAdmin.classList.remove('hidden');
    } else {
        btnAdmin.classList.add('hidden');
    }
   
    usuarioActual = { nombre, telefono };
    document.getElementById('subtitulo').innerText = `¡Hola, ${nombre}!`;

 mostrarSeccion('step-menu');
});

// NAVEGACIÓN
document.getElementById('btn-menu-nueva').addEventListener('click', () => mostrarSeccion('step-services'));
document.getElementById('btn-menu-historial').addEventListener('click', () => {
    cargarHistorialCliente();
    mostrarSeccion('step-history');
});

// Acceso Privado del Barbero (Admin)
document.getElementById('btn-menu-admin').addEventListener('click', () => {
    const pinIngresado = prompt("Ingresa la clave de Administrador/Barbero:");
    if (pinIngresado === PIN_ADMIN) {
        cargarPanelAdmin();
        mostrarSeccion('step-admin');
    } else if (pinIngresado !== null) {
        alert("Clave incorrecta. Acceso denegado.");
    }
});

document.getElementById('btn-back-services').addEventListener('click', () => mostrarSeccion('step-menu'));
document.getElementById('btn-back-history').addEventListener('click', () => mostrarSeccion('step-menu'));
document.getElementById('btn-back-datetime').addEventListener('click', () => mostrarSeccion('step-services'));
document.getElementById('btn-back-admin').addEventListener('click', () => mostrarSeccion('step-menu'));

document.getElementById('btn-logout').addEventListener('click', () => {
    usuarioActual = null;
    document.getElementById('registerForm').reset();
    document.getElementById('subtitulo').innerText = 'Reserva tu cita en segundos';
    mostrarSeccion('step-register');
});

// 2. Selección de Servicio
document.getElementById('btn-next-service').addEventListener('click', function() {
    const servicioSeleccionado = document.querySelector('input[name="servicio"]:checked');
    const descripcion = document.getElementById('descripcionCorte').value.trim();
    
    if (!servicioSeleccionado) return alert('Por favor selecciona un servicio.');

   servicioTemp = {
    servicio: servicioSeleccionado.value,
    precio: parseFloat(servicioSeleccionado.getAttribute('data-precio')),
    descripcion: descripcion || 'Sin detalles especificados'
  };

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').setAttribute('min', hoy);
    
    mostrarSeccion('step-datetime');
});

// 3. Validar Horarios Ocupados al Cambiar Fecha
document.getElementById('fecha').addEventListener('change', async function() {
    const fechaSeleccionada = this.value;
    const selectHora = document.getElementById('hora');
   const citasGlobales = await obtenerTodasLasCitas();

    const horasOcupadas = citasGlobales
        .filter(c => c.fecha === fechaSeleccionada)
        .map(c => c.hora);

    Array.from(selectHora.options).forEach(option => {
        if (!option.value) return;
        
        if (horasOcupadas.includes(option.value)) {
            option.disabled = true;
            option.textContent = `${option.value} - (OCUPADO 🚫)`;
        } else {
            option.disabled = false;
            option.textContent = option.value;
        }
    });

    selectHora.value = "";
});

// 4. Confirmar Reserva
document.getElementById('btn-finish').addEventListener('click', async function(e) {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (!fecha || !hora) return alert('Por favor selecciona una fecha y hora disponible.');

  const nuevaCita = {
    id: Date.now(),
    cliente_nombre: usuarioActual.nombre,
    cliente_telefono: usuarioActual.telefono,
    servicio: servicioTemp.servicio,
    precio: servicioTemp.precio,
    descripcion: servicioTemp.descripcion,
    fecha_cita: fecha,
    hora_cita: hora
};
   const { data, error } = await supabaseClient
    .from('citas')
    .insert([nuevaCita]);

  if (error) {
    console.error('Error al guardar en Supabase:', error.message);
    return alert('Hubo un error al guardar la cita.');
  }

    alert(`¡Cita Confirmada!\n\nServicio: ${nuevaCita.servicio}\nFecha: ${fecha} a las ${hora}`);
    
    document.getElementById('descripcionCorte').value = "";
    document.getElementById('fecha').value = "";
    document.getElementById('hora').value = "";
    mostrarSeccion('step-menu');
});

// Historial Personal del Cliente
function cargarHistorialCliente() {
    const container = document.getElementById('citas-container');
    const citasGlobales = obtenerTodasLasCitas();
    const misCitas = citasGlobales.filter(c => c.telefono === usuarioActual.telefono);

    if (misCitas.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No tienes citas agendadas.</p>';
        return;
    }

    container.innerHTML = misCitas.map(c => `
        <div class="history-card">
            <h4>${c.servicio}</h4>
            <p>📅 <strong>Fecha:</strong> ${c.fecha} - ${c.hora}</p>
            <p>📝 <strong>Detalles:</strong> ${c.descripcion}</p>
            <p>💵 <strong>Precio:</strong> $${c.precio} MXN</p>
        </div>
    `).join('');
}

// Cargar Panel Privado de Administrador
function cargarPanelAdmin() {
    const container = document.getElementById('admin-citas-container');
    const citasGlobales = obtenerTodasLasCitas();
    
    const mesActual = new Date().toISOString().slice(0, 7);

    const citasDelMes = citasGlobales.filter(c => c.fecha.startsWith(mesActual));
    const totalGanancias = citasDelMes.reduce((sum, c) => sum + c.precio, 0);

    document.getElementById('stat-citas-mes').innerText = citasDelMes.length;
    document.getElementById('stat-ingresos-mes').innerText = `$${totalGanancias} MXN`;

    if (citasGlobales.length === 0) {
        container.innerHTML = '<p style="color: #888; text-align: center;">No hay ninguna cita en el sistema.</p>';
        return;
    }

    container.innerHTML = citasGlobales.map(c => `
        <div class="history-card">
            <h4>${c.servicio} - $${c.precio} MXN</h4>
            <p>👤 <strong>Cliente:</strong> ${c.cliente} (${c.telefono})</p>
            <p>📅 <strong>Agenda:</strong> ${c.fecha} @ ${c.hora}</p>
            <p>✂️ <strong>Corte solicitado:</strong> ${c.descripcion}</p>
        </div>
    `).join('');
}