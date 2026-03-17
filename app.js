// --- CONFIGURACIÓN GLOBAL ---
const TIEMPO_BOLA = 10000; // 10 segundos entre bolas

// --- MOTOR DE INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema Bingo Club cargado correctamente.");
    if (document.getElementById('listaSocios')) initAdmin();
    if (document.getElementById('relojDiscreto')) initJuego();
});

// --- FUNCIONES DE ADMINISTRACIÓN ---
function initAdmin() {
    renderSocios();
    // Actualizar el monitor cada 2 segundos
    setInterval(() => {
        const est = JSON.parse(localStorage.getItem('bingoEstado'));
        const gan = JSON.parse(localStorage.getItem('ganadorBingo'));
        if(est && est.ultima) document.getElementById('bolaCantada').innerText = est.ultima;
        if(gan) document.getElementById('datosGanador').innerHTML = `<b>${gan.nombre}</b> (${gan.hora})`;
    }, 2000);
}

function crearSocioMaestro() {
    const nom = document.getElementById('nombreSocio').value.trim();
    const can = parseInt(document.getElementById('cantCartones').value);

    if(!nom) return alert("Escribe un nombre.");
    
    const cod = Math.random().toString(36).substring(2,7).toUpperCase();
    const tabs = [];
    for(let i=0; i<can; i++) tabs.push(generarCarton());

    const socios = JSON.parse(localStorage.getItem('sociosBingo')) || [];
    socios.push({ nombre: nom, codigo: cod, cartones: tabs });
    
    localStorage.setItem('sociosBingo', JSON.stringify(socios));
    document.getElementById('nombreSocio').value = "";
    renderSocios();
    alert(`SOCIO: ${nom}\nCÓDIGO: ${cod}`);
}

function guardarProgramacion() {
    const fecha = document.getElementById('fechaSorteo').value;
    if(!fecha) return alert("Selecciona fecha y hora.");
    
    localStorage.setItem('fechaSorteoBingo', fecha);
    localStorage.removeItem('bingoEstado'); // Reinicia el bombo
    alert("Sorteo programado con éxito.");
}

function renderSocios() {
    const div = document.getElementById('listaSocios');
    if(!div) return;
    const socios = JSON.parse(localStorage.getItem('sociosBingo')) || [];
    div.innerHTML = socios.map((s, i) => `
        <div style="background:white; padding:10px; margin-bottom:5px; border-radius:8px; display:flex; justify-content:space-between;">
            <span>${s.nombre} (<b>${s.codigo}</b>)</span>
            <button onclick="eliminarSocio(${i})" style="color:red; border:none; background:none; cursor:pointer;">✕</button>
        </div>
    `).join('');
}

function eliminarSocio(i) {
    const socios = JSON.parse(localStorage.getItem('sociosBingo')) || [];
    socios.splice(i, 1);
    localStorage.setItem('sociosBingo', JSON.stringify(socios));
    renderSocios();
}

// --- GENERADOR DE CARTONES ---
function generarCarton() {
    const r = { B:[1,15], I:[16,30], N:[31,45], G:[46,60], O:[61,75] };
    let tab = {};
    ['B','I','N','G','O'].forEach(l => {
        let col = [];
        while(col.length < 5) {
            let n = Math.floor(Math.random() * (r[l][1]-r[l][0]+1)) + r[l][0];
            if(!col.includes(n)) col.push(n);
        }
        tab[l] = col.sort((a,b)=>a-b);
    });
    return tab;
}

// --- LÓGICA DE ACCESO (INDEX) ---
function validarEntrada() {
    const cod = document.getElementById('accessCode').value.toUpperCase();
    const socios = JSON.parse(localStorage.getItem('sociosBingo')) || [];
    const socio = socios.find(s => s.codigo === cod);
    
    if(socio) {
        sessionStorage.setItem('socioActual', JSON.stringify(socio));
        window.location.href = 'juego.html';
    } else {
        alert("Código no válido.");
    }
}

function reiniciarTodo() {
    if(confirm("¿Borrar todos los datos?")) {
        localStorage.clear();
        location.reload();
    }
}
