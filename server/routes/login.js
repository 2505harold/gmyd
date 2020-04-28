const express = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const app = express();

// ====================================
// login
// ====================================
app.post("/", (req, res) => {
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
        mensaje: "El usuario no existe",
        errors: err,
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Password incorrecto",
        errors: err,
      });
    }

    //asignacion de token al usuario autenticado
    usuarioDB.password = "NoVisible";
    const token = jwt.sign(
      { usuario: usuarioDB },
      "llave-secreta-jsonwebtoken",
      {
        expiresIn: 7200, //expira en 2 horas
      }
    );

    return res.status(200).json({
      ok: true,
      token: token,
      usuario: usuarioDB,
    });
  });
});

module.exports = app;
