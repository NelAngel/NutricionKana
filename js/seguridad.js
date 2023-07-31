// Función para comprobar las credenciales ingresadas
function checkCredentials(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar si las credenciales son correctas
    if (username === 'nely123' && password === 'teamo24/05') {
        // Redirigir a index.html al hacer clic en un botón
        const btn = document.createElement('button');
        btn.style.display = 'none';
        document.body.appendChild(btn);
        btn.click();
        window.open('index.html', '_blank');
    } else {
        alert('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
}

// Escuchar el evento de envío del formulario
document.getElementById('loginForm').addEventListener('submit', checkCredentials);
