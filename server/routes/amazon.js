const express = require("express");
const IpsAmazon = require("../models/prefix-amazon");
const RegionesAmazon = require("../models/region-amazon");
const axios = require("axios");
const awsRegions = require("aws-regions");
const ping = require("ping");
const app = express();

// ====================================
// Guardar IPs de amazon
// ====================================
app.post("/ips", (req, res) => {
  const instance = axios.create({
    baseURL: "https://ip-ranges.amazonaws.com/ip-ranges.json",
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
// Obtener las IPs con sus regiones
// ====================================
app.get("/", (req, res) => {
  const buscar = req.query.buscar || "";
  const regex = new RegExp(buscar, "i");

  IpsAmazon.find({
    $or: [{ ip_prefix: regex }, { service: regex }, { region: regex }],
  }).exec(async (err, ipsamazon) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }

    RegionesAmazon.find({}).exec((err, regionesamazon) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      ipsamazon.forEach(async (item, index) => {
        var region = regionesamazon.filter((a) => {
          return a.code === item.region;
        });
        if (region.length > 0) {
          item.network_border_group = region[0].name;
        }
      });

      return res.status(200).json({
        ok: true,
        ipsamazon,
      });
    });
  });
});

// ====================================
// obtener latencia
// ====================================
app.get("/ping/:ip", (req, res) => {
  const ip = req.params.ip;
  ping.promise
    .probe(ip)
    .then(function (resp) {
      res.json(resp);
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

module.exports = app;
