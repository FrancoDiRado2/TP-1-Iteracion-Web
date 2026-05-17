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



class AnalyticsManager {
    constructor() {
        // Clave bajo la cual se guardará todo en el LocalStorage
        this.storageKey = 'tp1_game_stats';
        this.stats = this.loadStats();
    }

    // Cargar estadísticas previas o crear nuevas si no existen
    loadStats() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            return JSON.parse(savedData); // Convierte el texto guardado a un objeto JS
        }
        // Estructura inicial si es la primera vez que juega
        return {
            partidasJugadas: 0,
            eventos: {}
        };
    }

    // Función principal para registrar cualquier evento
    trackEvent(eventName) {
        // Si el evento no existe en el objeto, lo inicializa en 0
        if (!this.stats.eventos[eventName]) {
            this.stats.eventos[eventName] = 0;
        }
        // Suma 1 al contador de ese evento específico
        this.stats.eventos[eventName]++;
        this.save();
        console.log(`[Analytics] Evento capturado: ${eventName} | Cantidad: ${this.stats.eventos[eventName]}`);
    }

    // Función específica para registrar una nueva partida
    registrarNuevaPartida() {
        this.stats.partidasJugadas++;
        this.save();
        console.log(`[Analytics] Nueva partida registrada. Total: ${this.stats.partidasJugadas}`);
    }

    // Guarda el objeto actualizado en el LocalStorage
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }
}

// Inicializamos el gestor para que esté disponible globalmente
const gameAnalytics = new AnalyticsManager();