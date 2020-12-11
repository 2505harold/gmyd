const express = require("express");
const IpsAmazon = require("../models/prefix-amazon");
const RegionesAmazon = require("../models/region-amazon");
const PcsAmazon = require("../models/amazon/pcs");
const PingAmazon = require("../models/ping/ping-amazon");
const MetricasDelay = require("../models/amazon/metricas-delay");
const URL_PREFIX_AMAZON = require("../config/variables").URL_PREFIX_AMAZON;
const { isInSubnet } = require("is-in-subnet");
const axios = require("axios");
const awsRegions = require("aws-regions");
const dateformat = require("dateformat");
const { orderBy, groupBy } = require("lodash");
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
      IpsAmazon.find({}).exec(async (err, ipsamazon) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: "Ocurrio un error con obtener la lista",
            error: err,
          });
        }
        //prefijos de amazon desde su servidor
        let redesAmazon = resp.data.prefixes;

        //en caso recien se esta cargando los prefijos anuestra base de datos
        if (ipsamazon.length === 0) {
          var prefix = new IpsAmazon();
          prefix.collection.insertMany(redesAmazon, (err, prefixGuardados) => {
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
          });
        }

        //obtenemos los nuevos prefijos
        let prefixNoGuardados = [];
        redesAmazon.forEach((red, index) => {
          let prefijoGuardado = ipsamazon.filter((item) => {
            return (
              item.ip_prefix === red.ip_prefix && item.service === red.service
            );
          });
          if (prefijoGuardado.length === 0) {
            prefixNoGuardados.push(red);
          }
        });

        //Guardamos los nuevos prefijos
        if (prefixNoGuardados.length > 0) {
          var prefix = new IpsAmazon();
          prefix.collection.insertMany(
            prefixNoGuardados,
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
        } else {
          return res.status(200).json({
            ok: true,
            mensaje: "No hay prefijos nuevos",
          });
        }
      });
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
      .populate("link_internacional")
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
  const buscar = req.query.buscar === "todo" ? "" : req.query.buscar;
  const desde = req.query.desde || 0;
  const limite = req.query.limite || 10;
  const regex = new RegExp(buscar, "i");

  IpsAmazon.find({
    $or: [{ ip_prefix: regex }, { service: regex }, { region: regex }],
  })
    .skip(Number(desde))
    .populate("link_internacional")
    .limit(Number(limite))
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
// Obtener regiones de amazon
// ====================================
app.get("/regiones/total", (req, res) => {
  RegionesAmazon.find({}).exec((err, datos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      regiones: datos,
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
// Obtener promedio de latencias por fecha captura
// ====================================
app.get("/ping/:tipo/promedio", (req, res) => {
  const desde = new Date(req.query.desde);
  const hasta = new Date(req.query.hasta);
  const categoria = req.params.tipo;

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
          fecha: "$fecha",
          region: "$region.network_border_group",
          operador: "$operador",
        },
        avg: { $avg: { $toDecimal: "$avg" } },
      },
    },
  ])
    .allowDiskUse(true)
    .exec((err, latencias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      //ordenar por fecha
      const _latencias = orderBy(latencias, "_id.fecha", "asc");

      //creamos el objeto que retornaremos
      let datos = [];
      //obtenemos los operadores
      const operadores = [
        ...new Set(_latencias.map((item) => item._id.operador)),
      ];
      //Obtensmos las regiones
      RegionesAmazon.find({}).exec((err, regiones) => {
        const regionesMostrar = [
          "US East (N. Virginia)",
          "US East (Ohio)",
          "US West (N. California)",
          "US West (Oregon)",
          "South America (São Paulo)",
        ];

        //cambiamos el valor del key region de 'res'
        regiones.forEach((region) => {
          _latencias.map((item) => {
            if (item._id.region[0] === region.code) {
              return (item._id.region[0] = region.full_name);
            }
          });
        });

        //agrupamos por operador
        operadores.forEach((operador) => {
          const metricas = [];
          regionesMostrar.forEach((regionMostrar) => {
            const series = [];
            _latencias.forEach((latencia) => {
              if (
                latencia._id.region[0] === regionMostrar &&
                latencia._id.operador === operador
              ) {
                series.push({
                  name: latencia._id.fecha,
                  value: parseFloat(latencia.avg),
                });
              }
            });
            metricas.push({ name: regionMostrar, series });
          });

          datos.push({ operador, metricas });
        });

        const _datos = orderBy(datos, ["operador"], ["asc"]);

        return res.status(200).json({
          ok: true,
          datos: _datos,
        });
      });
    });
});

// function obtenerDelayAmazon(inicio, fin) {
//   return new Promise((resolve, reject) => {
//     MetricasDelay.find({
//       fecha: {
//         $gte: new Date(inicio),
//         $lte: new Date(fin),
//       },
//     })
//       .sort({ fecha: "asc" })
//       .exec((err, delays) => {
//         if (err) {
//           reject("error al cargar las metricas");
//         } else {
//           resolve(delays);
//         }
//       });
//   });
// }

// function obtenerPcsAmazon() {
//   return new Promise((resolve, reject) => {
//     PcsAmazon.find({}).exec((err, pcs) => {
//       if (err) {
//         reject("error al cargar las pcs");
//       } else {
//         resolve(pcs);
//       }
//     });
//   });
// }

// ====================================
// Actualizar IPs prefix amazon con link internacional
// ====================================
app.put("/ips/:id", (req, res) => {
  const id = req.params.id;
  IpsAmazon.findById(id, (err, prefijo) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar prefijo",
        error: err,
      });
    }

    if (!prefijo) {
      return res.status(400).json({
        ok: false,
        mensaje: "El prefijo con ID " + id + " no existe",
        error: err,
      });
    }

    prefijo.link_internacional = req.body.link_internacional;

    prefijo.save((err, prefijoActualizado) => {
      return res.status(200).json({
        ok: true,
        link: prefijoActualizado,
      });
    });
  });
});

// ====================================
// Obtener grupo de fechas almacenados
// ====================================
app.get("/metricas/delay/guardados", (req, res) => {
  MetricasDelay.aggregate([
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
// Obtener grupo de ping almacenados por dia
// ====================================
app.get("/numeros/ping/guardados", (req, res) => {
  PingAmazon.aggregate([
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
// Eliminar metricas delay por fecha
// ====================================
app.delete("/metricas/delay/:fecha", (req, res) => {
  const fecha = req.params.fecha;
  const actual = new Date(fecha);
  let siguiente = actual.setDate(actual.getDate() + 1);

  MetricasDelay.deleteMany(
    { fecha: { $gte: fecha, $lte: siguiente } },
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

// ====================================
// Eliminar metricas ping por fecha elegida
// ====================================
app.delete("/ping/:fecha", (req, res) => {
  const fecha = req.params.fecha;
  const _fecha = dateformat(fecha, "yyyy-m-d");
  const next = new Date(fecha);
  next.setDate(next.getDate() + 2);
  let _next = dateformat(next, "yyyy-m-d");

  PingAmazon.deleteMany(
    { fecha: { $gte: _fecha, $lte: _next } },
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
