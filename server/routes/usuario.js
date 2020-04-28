const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const app = express();

// ====================================
// Crear nuevo usuario
// ====================================
app.post("/", (req, res) => {
  var body = req.body;
  body.password = bcrypt.hashSync(body.password);
  const usuario = new Usuario({
    correo: body.correo,
    password: body.password,
    nombre: body.nombre,
    apellido: body.apellido,
    departamento: body.departamento,
    provincia: body.provincia,
    distrito: body.distrito,
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar usuario",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      usuario: usuarioGuardado,
    });
  });
});

module.exports = app;
