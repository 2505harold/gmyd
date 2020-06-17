const express = require("express");
const app = express();
const PingAmazon = require("../models/ping/ping-amazon");
const PingTutela = require("../models/ping/ping-tutela");

// ====================================
// obtener latencia Amazon
// ====================================
app.get("/amazon/:region", (req, res) => {
  const region = req.params.region;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  PingAmazon.aggregate([
    {
      $lookup: {
        from: "ipsamazon",
        localField: "prefijo",
        foreignField: "_id",
        as: "region",
      },
    },
    {
      $match: {
        avg: { $ne: "unknown" },
        fecha: { $gte: new Date(desde), $lte: new Date(hasta) },
      },
    },
    { $sort: { operador: -1 } },
    {
      $group: {
        _id: {
          operador: "$operador",
          ip: "$host",
          region: "$region.network_border_group",
        },
        avg: { $avg: { $toDecimal: "$avg" } },
      },
    },
  ]).exec((err, datos) => {
    if (region != "todo")
      datos = datos.filter((item) => item._id.region[0] === region);
    res.json({ datos });
  });
});

// ====================================
// Obetener latencia Tutela
// ====================================
app.get("/tutela/:tipo", (req, res) => {
  const tipo = req.params.tipo;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  PingTutela.aggregate([
    {
      $match: {
        avg: { $ne: "unknown" },
        fecha: { $gte: new Date(desde), $lte: new Date(hasta) },
      },
    },
    { $sort: { operador: -1 } },
    {
      $group: {
        _id: {
          operador: "$operador",
          ip: "$host",
          tipo: "$tipo",
        },
        avg: { $avg: { $toDecimal: "$avg" } },
      },
    },
  ]).exec((err, datos) => {
    if (tipo != "todo")
      datos = datos.filter((item) => item._id.tipo === tipo.toLowerCase());
    res.json({ datos });
  });
});

module.exports = app;
