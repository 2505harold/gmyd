const express = require("express");
const app = express();
const PingAmazon = require("../models/ping/ping-amazon");
const PingTutela = require("../models/ping/ping-tutela");
const PingOpenSignal = require("../models/ping/ping-opensignal");

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
    { $sort: { operador: 1 } },
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
// Obetener promedio latencia al dia - Tutela
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
    { $sort: { operador: 1 } },
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

// ====================================
// Obtener historico de latencias TUTELA por tipo
// ====================================
app.get("/tutela/grafico/:tipo", (req, res) => {
  const tipo = req.params.tipo;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  PingTutela.aggregate([
    {
      $match: {
        avg: { $ne: "unknown" },
        tipo: tipo,
        fecha: { $gte: new Date(desde), $lte: new Date(hasta) },
      },
    },
    { $sort: { fecha: 1 } },
    { $sort: { operador: 1 } },
  ]).exec((err, resp) => {
    const hostsRep = resp.map((item) => item.host);
    const hosts = [...new Set(hostsRep)];
    const operadoresRep = resp.map((item) => item.operador);
    const operadores = [...new Set(operadoresRep)];
    let ipsMetricas = [];
    hosts.forEach((host) => {
      let metricas = resp.filter((item) => item.host === host);
      let datos = [];
      operadores.forEach((operador) => {
        let series = metricas.reduce((acumulador, metrica) => {
          if (metrica.operador === operador) {
            acumulador.push({ name: metrica.fecha, value: metrica.avg });
          }
          return acumulador;
        }, []);
        datos.push({ name: operador, series: series });
      });
      ipsMetricas.push({ host, metricas: datos });
    });

    res.json({ datos: ipsMetricas });
  });
});

// ====================================
// Obtener historico de latencias OPENSIGNAL por tipo
// ====================================
app.get("/opensignal/grafico", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  PingOpenSignal.aggregate([
    {
      $match: {
        avg: { $ne: "unknown" },
        fecha: { $gte: new Date(desde), $lte: new Date(hasta) },
      },
    },
    { $sort: { fecha: 1 } },
    { $sort: { operador: 1 } },
  ]).exec((err, resp) => {
    const hostsRep = resp.map((item) => item.host);
    const hosts = [...new Set(hostsRep)];
    const operadoresRep = resp.map((item) => item.operador);
    const operadores = [...new Set(operadoresRep)];
    let ipsMetricas = [];
    hosts.forEach((host) => {
      let metricas = resp.filter((item) => item.host === host);
      let datos = [];
      operadores.forEach((operador) => {
        let series = metricas.reduce((acumulador, metrica) => {
          if (metrica.operador === operador) {
            acumulador.push({ name: metrica.fecha, value: metrica.avg });
          }
          return acumulador;
        }, []);
        datos.push({ name: operador, series: series });
      });
      ipsMetricas.push({ host, metricas: datos });
    });

    res.json({ datos: ipsMetricas });
  });
});

module.exports = app;
