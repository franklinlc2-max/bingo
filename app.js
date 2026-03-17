// --- LÓGICA DE JUEGO ---
function intentarBingo(idx) {
    const btn = document.getElementById(`btn-${idx}`);
    const socio = JSON.parse(sessionStorage.getItem('socioActual'));
    const estado = JSON.parse(localStorage.getItem('bingoEstado'));
    const cartonDiv = document.getElementById(`carton-${idx}`);
    
    if (!estado || !estado.bolas) return;

    // 1. Obtener todos los números del cartón (menos el comodín)
    let celdas = Array.from(cartonDiv.querySelectorAll('.cell'));
    let numerosDelCarton = celdas
        .filter(c => !c.classList.contains('comodin'))
        .map(c => parseInt(c.innerText));

    // 2. Verificar si TODOS los números del cartón están en las bolas cantadas
    let tieneTodoElCarton = numerosDelCarton.every(num => estado.bolas.includes(num));

    // 3. Verificar si el socio marcó la última bola cantada (condición de victoria)
    let ultimaBolaCantada = estado.ultima;
    let marcoUltimaBola = numerosDelCarton.includes(ultimaBolaCantada);

    if (tieneTodoElCarton && marcoUltimaBola) {
        // ¡BINGO REAL!
        localStorage.setItem('ganadorOficial', socio.nombre);
        localStorage.setItem('ganadorBingo', JSON.stringify({nombre: socio.nombre, hora: new Date().toLocaleTimeString()}));
        alert("¡FELICIDADES! Has ganado el Bingo.");
    } else {
        // BINGO FALSO - Penalización 15 seg
        penalizarBoton(btn);
        alert("¡BINGO FALSO! Aún faltan números o no has marcado la última bola.");
    }
}

function penalizarBoton(btn) {
    btn.disabled = true;
    btn.classList.add('btn-disabled');
    let seg = 15;
    const timer = setInterval(() => {
        btn.innerText = `BLOQUEADO (${seg}s)`;
        seg--;
        if (seg < 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.classList.remove('btn-disabled');
            btn.innerText = "¡CANTAR BINGO!";
        }
    }, 1000);
}

// --- GENERACIÓN DE CARTONES (MANTENIENDO EL ORDEN CORRECTO) ---
function dibujarTablas(tabs) {
    const container = document.getElementById('cartonesContainer');
    container.innerHTML = tabs.map((t, idx) => {
        let celdasHTML = "";
        // Generamos por FILAS para que visualmente coincidan con las letras B I N G O
        for (let i = 0; i < 5; i++) {
            ['B','I','N','G','O'].forEach(l => {
                const v = t[l][i];
                const esCentro = (l === 'N' && i === 2);
                celdasHTML += `<div class="cell ${esCentro ? 'comodin marked' : ''}" onclick="this.classList.toggle('marked')">${v}</div>`;
            });
        }
        return `
            <div class="carton-card" id="carton-${idx}">
                <div style="display:grid; grid-template-columns: repeat(5,1fr); text-align:center; font-weight:bold; color:var(--marine); margin-bottom:5px;">
                    <span>B</span><span>I</span><span>N</span><span>G</span><span>O</span>
                </div>
                <div class="bingo-grid">${celdasHTML}</div>
                <button class="btn-bingo-carton" id="btn-${idx}" onclick="intentarBingo(${idx})">¡CANTAR BINGO!</button>
            </div>
        `;
    }).join('');
}