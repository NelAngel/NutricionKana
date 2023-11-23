// Importar módulos necesarios
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Agrega esta línea para importar la biblioteca bcrypt
const User = require('./models/user'); // Asegúrate de que la ruta del modelo sea correcta

// Crear una instancia de Express
const app = express();

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://root:secret@localhost:27017/users', {
  authSource: 'admin',
  useNewUrlParser: true, // Agrega esta opción para evitar advertencias de deprecación
  useUnifiedTopology: true, // Agrega esta opción para evitar advertencias de deprecación
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Manejar solicitud POST a /login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar las credenciales en tu base de datos (aquí debes implementar tu lógica específica)
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      // Credenciales correctas, redirigir a la página principal (index.html)
      res.redirect('/index.html');
    } else {
      // Credenciales incorrectas, mostrar mensaje de error o redirigir nuevamente a la página de inicio de sesión
      res.status(401).json({ mensaje: 'Credenciales incorrectas. Vuelve e intenta de nuevo.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud', error: error.message });
  }
});

// Manejar solicitud POST a /registro
app.post('/registro', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que el username no sea nulo y otros controles de validación
    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = new User({ username, password });
    await newUser.save();

    // Redirigir a la página de registro exitoso o mostrar un mensaje de confirmación
    res.redirect('/registro_exitoso.html');
  } catch (error) {
    // Manejar errores, por ejemplo, si el nombre de usuario ya está en uso
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      return res.status(400).json({ mensaje: 'Nombre de usuario ya está en uso.' });
    }

    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
  }
});

// Otros manejadores de rutas
app.get('/', (req, res) => {
  // Manejar la solicitud GET a la ruta principal
  res.sendFile(path.join(__dirname, 'public', 'seguridad.html'));
});

// Configurar el puerto y iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
