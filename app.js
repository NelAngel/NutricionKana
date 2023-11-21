  // app.js
  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');
  const User = require('./models/user');

  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  mongoose.connect('mongodb://root:secret@localhost:27017/users', {
    authSource: 'admin'
  });
  

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
  db.once('open', () => {
    console.log('Conexión exitosa a MongoDB');
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seguridad.html'));
  });

  app.post('/registro', async (req, res) => {
    try {
      const { username, password, email } = req.body;
  
      // Validar que el username no sea nulo
      if (!username) {
        return res.status(400).json({ mensaje: 'El nombre de usuario no puede estar vacío.' });
      }
  
      const newUser = new User({ username, password, email });
      await newUser.save();
  
      res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ mensaje: 'Nombre de usuario ya está en uso.' });
      }
  
      console.error(error);
      res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
    }
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seguridad.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
