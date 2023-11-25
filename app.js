// Importar módulos necesarios
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

// Crear una instancia de Express
const app = express();

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://root:secret@localhost:27017/users', {
  authSource: 'admin',
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
    const { username, password, email, dni, edad } = req.body;

    // Validar que los campos no estén vacíos
    if (!username || !password || !email || !dni || !edad) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = new User({ username, password, email, dni, edad });
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

// Nueva ruta para manejar la recuperación de contraseña
app.post('/recover', async (req, res) => {
  try {
    const { username, email, dni, newPassword } = req.body;

    // Realizar la validación de los datos, por ejemplo, comparar con la información en la base de datos
    // (Aquí debes implementar tu lógica específica de validación)

    // Supongamos que la validación es exitosa y puedes cambiar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const user = await User.findOneAndUpdate(
      { username, email, dni },
      { password: hashedPassword },
      { new: true } // Esto devuelve el documento actualizado
    );

    if (!user) {
      // Si no se encuentra el usuario con los datos proporcionados, puedes mostrar un mensaje de error
      return res.status(404).json({ mensaje: 'No se encontró el usuario con la información proporcionada.' });
    }

    // Envía una respuesta indicando que la recuperación fue exitosa
    res.status(200).json({ mensaje: 'Contraseña recuperada exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la solicitud', error: error.message });
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
