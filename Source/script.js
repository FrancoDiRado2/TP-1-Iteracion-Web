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