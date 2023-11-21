  const mongoose = require('mongoose');
  const bcrypt = require('bcrypt');
  const saltRounds = 10;

  const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  // Lógica adicional, como la encriptación de contraseñas antes de guardarlas
  UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });

  // Método para personalizar la representación JSON del documento
  UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    // Puedes eliminar campos sensibles del objeto antes de devolverlo como JSON
    delete userObject.password;
    return userObject;
  };

  const User = mongoose.model('User', UserSchema);

  module.exports = User;
