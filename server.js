// user.js
const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales en tu base de datos (ejemplo simplificado)
  if (username === 'usuario' && password === 'contraseña') {
    // Credenciales correctas, redirige a index.html
    res.redirect('/index.html');
  } else {
    // Credenciales incorrectas, muestra un mensaje de error
    res.send('Credenciales incorrectas. Vuelve e intenta de nuevo.');
  }
});

module.exports = router;
