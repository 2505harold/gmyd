const express = require("express");
const app = express();
const IpsOpenSignal = require("../models/opensignal/prefix");

// ====================================
// Guardar Ips de Open signal
// ====================================
app.post("/", (req, res) => {
  const body = req.body;
  const open = new IpsOpenSignal({
    ip: body.ip,
    user: body.user,
    fecha: body.fecha,
    tipo: body.tipo,
  });

  open.save((err, datoGuardado) => {
    if (err) {
      return res
        .status(500)
        .json({ ok: false, mensaje: "Error en el sevidor", error: err });
    }

    return res.status(200).json({ ok: true, dato: datoGuardado });
  });
});
// ====================================
// Obtener IPs o URL de OpenSignal
// ====================================
app.get("/", (req, res) => {
  IpsOpenSignal.find({})
    .populate("user")
    .exec((err, ips) => {
      if (err) {
        res
          .status(200)
          .json({ ok: false, mensaje: "Error en el servidor", error: err });
      }

      res.status(200).json({ ok: true, datos: ips });
    });
});

module.exports = app;
