const express = require("express");
const IpsAmazon = require("../models/prefix-amazon");
const RegionesAmazon = require("../models/region-amazon");
const PcsAmazon = require("../models/amazon/pcs");
const MetricasDelay = require("../models/amazon/metricas-delay");
const URL_PREFIX_AMAZON = require("../config/variables").URL_PREFIX_AMAZON;
const { isInSubnet } = require("is-in-subnet");
const axios = require("axios");
const awsRegions = require("aws-regions");
const ping = require("ping");
const app = express();

// ====================================
// Guardar IPs de amazon
// ====================================
app.post("/ips", (req, res) => {
  const instance = axios.create({
    baseURL: URL_PREFIX_AMAZON,
  });
  instance
    .get()
    .then(async (resp) => {
      //eliminamos todoslos registros para insertar nuevos
      await IpsAmazon.deleteMany({});
      //guardamos nuevos registros
      var prefix = new IpsAmazon();
      prefix.collection.insertMany(
        resp.data.prefixes,
        (err, prefixGuardados) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "error al guardar los datos",
              error: err,
            });
          }
          return res.status(200).json({
            ok: true,
            prefixGuardados,
          });
        }
      );
    })
    .catch((error) => {
      res.json(error);
    });
});

// ====================================
// Guardar regiones de amazon
// ====================================
app.post("/regiones", async (req, res) => {
  //const regiones = awsRegions.list()
  await RegionesAmazon.remove({});
  var regiones = new RegionesAmazon();
  regiones.collection.insertMany(
    awsRegions.list(),
    (err, regionesGuardadas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "error al guardar los datos",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        regionesGuardadas,
      });
    }
  );
});

// ====================================
// Obtner los rangos de Amazon por IP subnet
// ====================================
app.get("/:ip", (req, res) => {
  const desde = req.query.desde || 0;
  const ip = req.params.ip;

  IpsAmazon.find({}).exec((err, ipsamazon) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }

    //si no hay error valido en que red se encuentra la IP buscada
    var prefix = [];
    ipsamazon.forEach((item, index) => {
      if (isInSubnet(ip, item.ip_prefix)) {
        prefix.push({ ip_prefix: item.ip_prefix });
      }
    });

    IpsAmazon.find({ $or: prefix })
      .skip(Number(desde))
      .limit(10)
      .exec((err, ipsamazon) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Ocurrio un error con obtener la lista",
            error: err,
          });
        }

        ipsamazon.map(function (el) {
          var o = Object.assign({}, el);
          (o._doc.name = "Not Found"), (o._doc.full_name = "Not Found");
          return o;
        });

        IpsAmazon.countDocuments(
          {
            $or: prefix,
          },
          (err, cantidad) => {
            RegionesAmazon.find({}).exec((err, regionesamazon) => {
              if (err) {
                return res.status(500).json({
                  ok: false,
                  mensaje: "Ocurrio un error con obtener la lista",
                  error: err,
                });
              }
              var count = 0;
              ipsamazon.forEach(async (item, index) => {
                count++;
                var region = regionesamazon.filter((a) => {
                  return a.code === item.region;
                });
                if (region.length > 0) {
                  item._doc.name = region[0].name;
                  item._doc.full_name = region[0].full_name;
                }
              });

              return res.status(200).json({
                ok: true,
                total: cantidad,
                relativo: count,
                ipsamazon,
              });
            });
          }
        );
      });
  });
});

// ====================================
// Obtener las IPs con sus regiones
// ====================================
app.get("/", (req, res) => {
  const buscar = req.query.buscar || "";
  const desde = req.query.desde || 0;
  const regex = new RegExp(buscar, "i");

  IpsAmazon.find({
    $or: [{ ip_prefix: regex }, { service: regex }, { region: regex }],
  })
    .skip(Number(desde))
    .limit(10)
    .exec((err, ipsamazon) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      ipsamazon.map(function (el) {
        var o = Object.assign({}, el);
        (o._doc.name = "Not Found"), (o._doc.full_name = "Not Found");
        return o;
      });

      IpsAmazon.countDocuments(
        { $or: [{ ip_prefix: regex }, { service: regex }, { region: regex }] },
        (err, cantidad) => {
          RegionesAmazon.find({}).exec((err, regionesamazon) => {
            if (err) {
              return res.status(500).json({
                ok: false,
                mensaje: "Ocurrio un error con obtener la lista",
                error: err,
              });
            }
            var count = 0;
            ipsamazon.forEach(async (item, index) => {
              count++;
              var region = regionesamazon.filter((a) => {
                return a.code === item.region;
              });
              if (region.length > 0) {
                item._doc.name = region[0].name;
                item._doc.full_name = region[0].full_name;
              }
            });

            return res.status(200).json({
              ok: true,
              total: cantidad,
              relativo: count,
              ipsamazon,
            });
          });
        }
      );
    });
});

// ====================================
// obtener latencia
// ====================================
app.get("/ping/:ip", (req, res) => {
  const ip = req.params.ip;
  ping.promise
    .probe(ip.trim())
    .then(function (resp) {
      res.json(resp);
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

// ====================================
// Guardar PCs amazon
// ====================================
app.post("/pc", (req, res) => {
  const body = req.body;
  const pcAmazon = new PcsAmazon(body);
  pcAmazon.save((err, pcguardada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar pc",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      pc: pcguardada,
    });
  });
});

// ====================================
// Leer PCs de amazon
// ====================================
app.get("/pcs/ec2", (req, res) => {
  PcsAmazon.find({}).exec((err, datos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      pcs: datos,
    });
  });
});

// ====================================
// Guardar metrias de delay
// ====================================
app.post("/metricas/delay", (req, res) => {
  const body = req.body;
  const metrica = new MetricasDelay(body);
  metrica.save((err, metricaGuardada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar metricas",
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
// Obtener metricas delay
// ====================================
app.get("/metricas/delay", (req, res) => {
  MetricasDelay.find({})
    .populate("pc", "region")
    .sort({ fecha: "asc" })
    .exec((err, datos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        datos,
      });
    });
});

module.exports = app;
