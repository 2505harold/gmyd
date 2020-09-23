const express = require("express");
const app = express();
const PingAmazon = require("../models/ping/ping-amazon");
const PingTutela = require("../models/ping/ping-tutela");
const PingOpenSignal = require("../models/ping/ping-opensignal");
const { orderBy, sortBy, groupBy, forEach } = require("lodash");

// ====================================
// obtener latencia Amazon
// ====================================
app.get("/amazon/:categoria/:region", (req, res) => {
  const region = req.params.region;
  const desde = new Date(req.query.desde);
  const hasta = new Date(req.query.hasta);
  const categoria = req.params.categoria;
  PingAmazon.aggregate([
    {
      $addFields: {
        convertedDate: { $toDate: "$fecha" },
      },
    },
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
        convertedDate: { $gte: desde, $lte: hasta },
        categoria: { $regex: new RegExp(categoria, "i") },
      },
    },
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
    datos = orderBy(datos, ["_id.ip", "_id.operador"], ["asc", "asc"]);
    res.json({ datos });
  });
});

// ====================================
// Obtener historico agrupado de latencias TUTELA
// ====================================
app.get("/tutela/historico", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  PingTutela.aggregate([
    {
      $match: {
        avg: { $ne: "unknown" },
        fecha: { $gte: desde, $lte: hasta },
      },
    },
    {
      $sort: { fecha: 1 },
    },
  ]).exec((err, resp) => {
    const operadoresRep = resp.map((item) => item.operador);
    const operadores = sortBy([...new Set(operadoresRep)]);
    const groupByNameHost = groupBy(resp, "namehost");
    let datos = [];
    forEach(groupByNameHost, (arrayObjs) => {
      const groupByHost = groupBy(arrayObjs, "host");
      const hosts = [];
      const latencias = [];

      operadores.forEach((operador) => {
        let series = arrayObjs.reduce((acumulador, objeto) => {
          if (objeto.operador === operador) {
            acumulador.push({ name: objeto.fecha, value: objeto.avg });
          }
          return acumulador;
        }, []);
        latencias.push({ name: operador, series: series });
      });

      forEach(groupByHost, (arrayObjHost) => {
        let delayHost = [];
        operadores.forEach((operador) => {
          let series = arrayObjHost.reduce((acumulador, metrica) => {
            if (metrica.operador === operador) {
              acumulador.push({ name: metrica.fecha, value: metrica.avg });
            }
            return acumulador;
          }, []);
          delayHost.push({ name: operador, series });
        });
        hosts.push({ ip: arrayObjHost[0].host, metricas: delayHost });
      });
      datos.push({ nameHost: arrayObjs[0].namehost, latencias, hosts });
    });

    res.json({ datos });
  });
});

// ====================================
// Obtener historico agrupado de latencias OPENSIGNAL
// ====================================
app.get("/opensignal/historico", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  console.log(hasta);
  PingOpenSignal.aggregate([
    {
      $match: {
        avg: { $ne: "unknown" },
        fecha: { $gte: desde, $lte: hasta },
      },
    },
    {
      $sort: { fecha: 1 },
    },
  ]).exec((err, resp) => {
    const operadoresRep = resp.map((item) => item.operador);
    const operadores = sortBy([...new Set(operadoresRep)]);
    const groupByNameHost = groupBy(resp, "namehost");
    let datos = [];
    forEach(groupByNameHost, (arrayObjs) => {
      const groupByHost = groupBy(arrayObjs, "host");
      const hosts = [];
      const latencias = [];

      operadores.forEach((operador) => {
        let series = arrayObjs.reduce((acumulador, objeto) => {
          if (objeto.operador === operador) {
            acumulador.push({ name: objeto.fecha, value: objeto.avg });
          }
          return acumulador;
        }, []);
        latencias.push({ name: operador, series: series });
      });

      forEach(groupByHost, (arrayObjHost) => {
        let delayHost = [];
        operadores.forEach((operador) => {
          let series = arrayObjHost.reduce((acumulador, metrica) => {
            if (metrica.operador === operador) {
              acumulador.push({ name: metrica.fecha, value: metrica.avg });
            }
            return acumulador;
          }, []);
          delayHost.push({ name: operador, series });
        });
        hosts.push({ ip: arrayObjHost[0].host, metricas: delayHost });
      });
      datos.push({ nameHost: arrayObjs[0].namehost, latencias, hosts });
    });

    res.json({ datos });
  });
});
// app.get("/opensignal/grafico/:categoria", (req, res) => {
//   const desde = new Date(req.query.desde);
//   const hasta = new Date(req.query.hasta);
//   const categoria = req.params.categoria;
//   PingOpenSignal.aggregate([
//     {
//       $addFields: {
//         convertedDate: { $toDate: "$fecha" },
//       },
//     },
//     {
//       $match: {
//         avg: { $ne: "unknown" },
//         convertedDate: { $gte: desde, $lte: hasta },
//         categoria: { $regex: new RegExp(categoria, "i") },
//       },
//     },
//     { $sort: { fecha: 1, operador: -1 } },
//   ]).exec((err, resp) => {
//     const hostsRep = resp.map((item) => item.host);
//     const hosts = [...new Set(hostsRep)];
//     const operadoresRep = resp.map((item) => item.operador);
//     const operadores = sortBy([...new Set(operadoresRep)]);
//     let ipsMetricas = [];
//     hosts.forEach((host) => {
//       let metricas = resp.filter((item) => item.host === host);
//       let datos = [];
//       operadores.forEach((operador) => {
//         let series = metricas.reduce((acumulador, metrica) => {
//           if (metrica.operador === operador) {
//             acumulador.push({ name: metrica.fecha, value: metrica.avg });
//           }
//           return acumulador;
//         }, []);
//         datos.push({ name: operador, series: series });
//       });

//       ipsMetricas.push({ host, metricas: datos });
//     });
//     res.json({ datos: ipsMetricas });
//   });
// });

module.exports = app;
