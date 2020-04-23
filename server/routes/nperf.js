const express = require("express");
const Nperf = require("../models/metricas-nperf");
const app = express();

// ====================================
// Guardar metricas
// ====================================
app.post("/", (req, res) => {
  let nperf = new Nperf(req.body);
  nperf.save((err, metricaGuardada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metrica",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      metrica: metricaGuardada,
    });
  });
});

// ====================================
// Obtener metricas : -1 Mayor a Menor
// ====================================
app.get("/", (req, res) => {
  var desde = req.query.desde || 0;
  Nperf.find({})
    .sort({ fecha_ingreso: "asc" })
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        metricas,
      });
    });
});

module.exports = app;
