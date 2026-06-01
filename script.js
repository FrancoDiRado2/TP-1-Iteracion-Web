// Animación suave al hacer scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Validación del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value;

            if (nombre && email && asunto && mensaje) {
                alert('¡Gracias por tu mensaje! Te responderemos pronto.');
                form.reset();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }
});

// Efecto de aparición al hacer scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .game-card, .game-tip').forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Modo oscuro
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
};

// Verificar preferencia guardada
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Agregar botón de modo oscuro
const darkModeButton = document.createElement('button');
darkModeButton.innerHTML = '🌙';
darkModeButton.className = 'dark-mode-toggle';
darkModeButton.onclick = toggleDarkMode;
document.body.appendChild(darkModeButton); 


// ==========================================
// ANALYTICS LOCALES (TP1)
// ==========================================
class AnalyticsManager {
    constructor() {
        this.storageKey = 'tp1_game_stats';
        this.stats = this.loadStats();
    }

    loadStats() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            return JSON.parse(savedData); 
        }
        return {
            partidasJugadas: 0,
            eventos: {}
        };
    }

    trackEvent(eventName) {
        if (!this.stats.eventos[eventName]) {
            this.stats.eventos[eventName] = 0;
        }
        this.stats.eventos[eventName]++;
        this.save();
        console.log(`[Analytics] Evento capturado: ${eventName} | Cantidad: ${this.stats.eventos[eventName]}`);
    }

    registrarNuevaPartida() {
        this.stats.partidasJugadas++;
        this.save();
        console.log(`[Analytics] Nueva partida registrada. Total: ${this.stats.partidasJugadas}`);
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }
}

const gameAnalytics = new AnalyticsManager();


// ==========================================
// SISTEMA DE WEBSOCKETS PARA RANKING (TP2)
// ==========================================
class WebSocketManager {
    constructor(playerName) {
        this.socket = null;
        this.serverUrl = 'wss://gamehubmanager.azurewebsites.net/ws'; // Servidor de la cátedra
        this.playerName = playerName || 'Jugador Anónimo';
        this.gameName = 'Globos Explosivos';
    }

    conectar() {
        this.socket = new WebSocket(this.serverUrl);

        this.socket.onopen = () => {
            console.log('[WebSocket] Conectado exitosamente al servidor.');
        };

        this.socket.onmessage = (event) => {
            try {
                const rankingData = JSON.parse(event.data);
                this.actualizarRankingUI(rankingData);
            } catch (error) {
                console.error('[WebSocket] Error al procesar el JSON del ranking:', error);
            }
        };

        this.socket.onerror = (error) => {
            console.error('[WebSocket] Error de conexión:', error);
        };

        this.socket.onclose = () => {
            console.log('[WebSocket] Desconectado.');
        };
    }

    enviarPuntaje(puntajeActual) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            // Estructura JSON requerida por la consigna
            const data = {
                game: this.gameName,
                event: "puntaje_actualizado",
                player: this.playerName,
                value: puntajeActual
            };
            this.socket.send(JSON.stringify(data));
        }
    }

    actualizarRankingUI(datos) {
        const rankingContainer = document.getElementById('ranking-list');
        if (!rankingContainer) return;

        rankingContainer.innerHTML = ''; 

        // Filtrar y mostrar el ranking
        datos.forEach((jugador, index) => {
            const valor = jugador.value !== undefined ? jugador.value : jugador.Value;
            const li = document.createElement('li');
            
            // Destacar al jugador actual en la lista
            if (jugador.Player === this.playerName) {
                li.style.color = '#00ff00';
                li.style.fontWeight = 'bold';
            }
            
            li.textContent = `#${index + 1} ${jugador.Player} - ${valor} pts`;
            rankingContainer.appendChild(li);
        });
    }
}

// Pedimos el nombre al usuario al cargar para enviarlo al WebSocket
let nombreJugador = prompt("¡Bienvenido a Globos Explosivos! Ingresa tu nombre para el ranking global:", "Jugador");
if (!nombreJugador) nombreJugador = "Invitado";

const wsManager = new WebSocketManager(nombreJugador);