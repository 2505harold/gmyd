const express = require("express");
const IpsTutela = require("../models/tutela/prefix");
const PingTutela = require("../models/ping/ping-tutela");
const dateformat = require("dateformat");
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

// ====================================
// Obtener grupo de fechas almacenados
// ====================================
app.get("/numeros/ping/guardados", (req, res) => {
  PingTutela.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
        },
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }

    const dias = datos.length;

    return res.status(200).json({
      ok: true,
      dias,
      metricas: datos,
    });
  });
});

// ====================================
// Eliminar metricas ping por fecha elegida
// ====================================
app.delete("/ping/:fecha", (req, res) => {
  const fecha = req.params.fecha;
  const _fecha = dateformat(fecha, "yyyy-m-d");
  let _next = new Date(fecha);
  _next.setDate(_next.getDate() + 2);
  let next = dateformat(_next, "yyyy-m-d");

  PingTutela.deleteMany(
    { fecha: { $gte: fecha, $lte: next } },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar datos",
          error: err,
        });
      }
      res.status(200).json({
        ok: true,
        datos: result,
      });
    }
  );
});

module.exports = app;
