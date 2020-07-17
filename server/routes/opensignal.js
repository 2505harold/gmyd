const express = require("express");
const app = express();
const IpsOpenSignal = require("../models/opensignal/prefix");
const PingOpenSignal = require("../models/ping/ping-opensignal");
const dateformat = require("dateformat");

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

// ====================================
// Obtener grupo de fechas almacenados
// ====================================
app.get("/numeros/ping/guardados", (req, res) => {
  PingOpenSignal.aggregate([
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

  PingOpenSignal.deleteMany(
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
