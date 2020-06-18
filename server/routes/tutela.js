const express = require("express");
const IpsTutela = require("../models/tutela/prefix");
const { stringify } = require("querystring");
const app = express();

// ====================================
// Guardar ips o prfijos de tutela
// ====================================
app.post("/", (req, res) => {
  const body = req.body;
  const tutela = new IpsTutela({
    ip: body.ip,
    user: body.user,
    fecha: body.fecha,
    tipo: body.tipo,
  });

  tutela.save((err, datoGuardado) => {
    if (err) {
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error en el sevidor", error: err });
    }

    return res.status(200).json({ ok: true, datos: datoGuardado });
  });
});

// ====================================
// Obtener IPs o URL de Tutela
// ====================================
app.get("/", (req, res) => {
  IpsTutela.find({})
    .populate("user")
    .exec((err, ips) => {
      if (err) {
        res
          .status(200)
          .json({ ok: false, mensaje: "Error en el servidor", error: err });
      }

      res.status(200).json({ ok: true, ips });
    });
});

module.exports = app;
