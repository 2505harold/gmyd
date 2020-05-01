const express = require("express");
const Nperf = require("../models/metricas-nperf");
const velocidadesNperf = require("../models/velocidad-nperf");
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
// GUardar metricas de velocidad
// ====================================
app.post("/velocidad", (req, res) => {
  let nperf = new velocidadesNperf(req.body);
  nperf.save((err, datoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metricas",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      metrica: datoGuardado,
    });
  });
});

// ====================================
// Obtener metricas : -1 Mayor a Menor
// ====================================
app.get("/", (req, res) => {
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

// ====================================
// Obtener etricas de velocidades: -1 Mayor a Menor
// ====================================
app.get("/velocidades", (req, res) => {
  velocidadesNperf
    .find({})
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

// ====================================
// Obtener metricas with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  Nperf.find({})
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      Nperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

// ====================================
// Obtener metricas velocidades with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/velocidades/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  velocidadesNperf
    .find({})
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      velocidadesNperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

module.exports = app;
