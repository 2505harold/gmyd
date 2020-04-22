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
    apelido: body.apellido,
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

// ====================================
// login
// ====================================
app.post("/login", (req, res) => {
  const body = req.body;
  Usuario.findOne({ correo: body.correo }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "credenciales incorrectas - correo incorrecto",
        errors: err,
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "credenciales incorrectas - password incorrecto",
        errors: err,
      });
    }

    return res.status(200).json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

module.exports = app;
