const express = require("express");
const app = express();
const AppPingTutela = require("../models/pingApp/ping-tutela");
const AppPingAmazon = require("../models/pingApp/ping-amazon");
const AppPingOpensignal = require("../models/pingApp/ping-opensignal");
const helpers = require("../helpers/methods");
const AppFotoSiteTutela = require("../models/tutela/reporte.sites.photo");
const AppFotoSiteOpensignal = require("../models/opensignal/reporte.sites.photo");
const AppSiteTutela = require("../models/tutela/reporte.sites");
const AppSiteOpensignal = require("../models/opensignal/reporte.sites");
const { groupBy, map, forEach, orderBy, sortBy, filter } = require("lodash");

// ====================================
// Obtener IPs publicas por operador
// ====================================
app.get("/opensignal/ipspublicas", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
      },
    },
    {
      $group: {
        _id: {
          operador: "$operador",
          ippublic: "$ipPublic",
        },
        count: { $sum: 1 },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    const datosOrdenados = sortBy(datos, "_id.operador");
    const filterHasIpPublic = filter(datosOrdenados, "_id.ippublic");
    return res.json(filterHasIpPublic);
  });
});

// ====================================
// Obtener foto de reporte semanal
// del top de latencias por sitios TUTELA
// ====================================
app.get("/tutela/foto/reporte/sem/delay", (req, res) => {
  const subregion = req.query.subregion
    ? { subregion: req.query.subregion }
    : { subregion: { $regex: new RegExp("", "i") } };
  const top = req.query.top ? parseInt(req.query.top) : 9999999999;
  AppFotoSiteTutela.aggregate([
    {
      $match: subregion,
    },
    {
      $sort: { delayAvg: -1 },
    },
    {
      $limit: top,
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    return res.status(200).json({ ok: true, datos });
  });
});

// ====================================
// Obtener historico de reporte semanal
// del top de latencias por sitios TUTELA
// ====================================
app.get("/tutela/historico/reporte/sem/delay", (req, res) => {
  const from = req.query.desde;
  const to = req.query.hasta;
  const subregion = req.query.subregion
    ? req.query.subregion
    : { $regex: new RegExp("", "i") };
  AppSiteTutela.aggregate([
    {
      $match: {
        hasta: { $gte: from, $lte: to },
        subregion,
      },
    },
    {
      $sort: { hasta: 1 },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    return res.status(200).json({ ok: true, datos });
  });
});

// ====================================
// Obtener foto de reporte semanal
// del top de latencias por sitios OPEN SIGNAL
// ====================================
app.get("/opensignal/foto/reporte/sem/delay", (req, res) => {
  const subregion = req.query.subregion
    ? { subregion: req.query.subregion }
    : { subregion: { $regex: new RegExp("", "i") } };
  const top = req.query.top ? parseInt(req.query.top) : 9999999999;
  AppFotoSiteOpensignal.aggregate([
    {
      $match: subregion,
    },
    {
      $sort: { delayAvg: -1 },
    },
    {
      $limit: top,
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    return res.status(200).json({ ok: true, datos });
  });
});

// ====================================
// Actualizar estadisticas
// de sites TUTELA
// ====================================
app.post("/tutela/cellid/reporte", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingTutela.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        operador: "Claro",
        networkType: "LTE",
      },
    },
    {
      $lookup: {
        from: "cellid_4G",
        localField: "Ci",
        foreignField: "CELL_ID",
        as: "cellid4G",
      },
    },
    {
      $group: {
        _id: {
          nodeName: "$cellid4G.MBTS_NAME",
          departamento: "$cellid4G.DEPARTAMENTO",
          provincia: "$cellid4G.PROVINCIA",
          distrito: "$cellid4G.DISTRITO",
          region: "$cellid4G.REGION",
          subRegion: "$cellid4G.SUB_REGION",
        },
        avg: { $avg: "$avg" },
        max: { $max: "$max" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, message: err });
    }

    const newData = map(datos, (item) => {
      return {
        nodeName: item._id.nodeName[0],
        departamento: item._id.departamento[0],
        provincia: item._id.provincia[0],
        distrito: item._id.distrito[0],
        region: item._id.region[0],
        subregion: item._id.subRegion[0],
        desde: desde,
        hasta: hasta,
        delayAvg: item.avg,
        delayMax: item.max,
      };
    });

    Promise.all([
      helpers.saveFotoReportWeekDelaySiteTutela(newData),
      helpers.saveReportWeekDelaySiteTutela(newData),
    ])
      .then((resp) => {
        return res
          .status(200)
          .json({ ok: true, message: "Datos guardados satisfactoriamente" });
      })
      .catch((err) => {
        return res.status(400).json({ ok: false, err });
      });
  });
});

// ====================================
// Actualizar estadisticas
// de sites OPENSIGNAL
// ====================================
app.post("/opensignal/cellid/reporte", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        operador: "Claro",
        networkType: "LTE",
      },
    },
    {
      $lookup: {
        from: "cellid_4G",
        localField: "Ci",
        foreignField: "CELL_ID",
        as: "cellid4G",
      },
    },
    {
      $group: {
        _id: {
          nodeName: "$cellid4G.MBTS_NAME",
          departamento: "$cellid4G.DEPARTAMENTO",
          provincia: "$cellid4G.PROVINCIA",
          distrito: "$cellid4G.DISTRITO",
          region: "$cellid4G.REGION",
          subRegion: "$cellid4G.SUB_REGION",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, message: err });
    }

    const newData = map(datos, (item) => {
      return {
        nodeName: item._id.nodeName[0],
        departamento: item._id.departamento[0],
        provincia: item._id.provincia[0],
        distrito: item._id.distrito[0],
        region: item._id.region[0],
        subregion: item._id.subRegion[0],
        desde: desde,
        hasta: hasta,
        delayAvg: item.avg,
        delayMax: item.max,
      };
    });

    Promise.all([
      helpers.saveFotoReportWeekDelaySiteOpensignal(newData),
      helpers.saveReportWeekDelaySitesOpensignal(newData),
    ])
      .then((resp) => {
        return res
          .status(200)
          .json({ ok: true, message: "Datos guardados satisfactoriamente" });
      })
      .catch((err) => {
        return res.status(400).json({ ok: false, err });
      });
  });
});

// ====================================
// Obtener promedio de latencias
// por distrito TUTELA
// ====================================
app.get("/tutela/:dep/:prov/distritos/stacked", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingTutela.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
        adminArea: req.params.dep,
        subAdminArea: req.params.prov,
      },
    },
    {
      $group: {
        _id: {
          distrito: "$locality",
          operador: "$operador",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    const datosOrdenados = sortBy(datos, (item) => {
      if (item._id.operador == "Claro") return item.avg;
    });
    const groupByDistrit = groupBy(datosOrdenados, "_id.distrito");
    var data = [];
    forEach(groupByDistrit, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el._id.operador });
      });
      data.push({ name: item[0]._id.distrito, series });
    });
    return res.status(200).json({ ok: true, datos: data });
  });
});

// ====================================
// Obtener promedio de latencias
// por distrito OPENSIGNAL
// ====================================
app.get("/opensignal/:dep/:prov/distritos/stacked", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
        adminArea: req.params.dep,
        subAdminArea: req.params.prov,
      },
    },
    {
      $group: {
        _id: {
          distrito: "$locality",
          operador: "$operador",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    const datosOrdenados = sortBy(datos, (item) => {
      if (item._id.operador == "Claro") return item.avg;
    });
    const groupByDistrit = groupBy(datosOrdenados, "_id.distrito");
    var data = [];
    forEach(groupByDistrit, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el._id.operador });
      });
      data.push({ name: item[0]._id.distrito, series });
    });
    return res.status(200).json({ ok: true, datos: data });
  });
});

// ====================================
// Get latencia general por Servidor
// ====================================
app.get("/tutela", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingTutela.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
      },
    },
    {
      $group: {
        _id: {
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
          operador: "$operador",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    var datosOrdenados = map(datos, (el) => {
      return { fecha: el._id.fecha, operador: el._id.operador, avg: el.avg };
    });
    const _datosOrdenados = orderBy(datosOrdenados, "fecha", "asc");
    const groupByOperador = groupBy(_datosOrdenados, "operador");
    var data = [];
    forEach(groupByOperador, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el.fecha });
      });
      data.push({ name: item[0].operador, series });
    });
    const sortName = sortBy(data, "name");
    res.status(200).json({ ok: true, data: sortName });
  });
});

// ====================================
// Obtener latencia por filtro
// ====================================
app.post("/tutela/filtro", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const body = req.body;
  var namehosts = [];
  var localities = [];
  var networkTypes = [];
  var subAdminAreas = [];
  var operadores = [];
  var cellids = [];

  body.forEach((item, index) => {
    if (item.networkType) networkTypes.push({ networkType: item.networkType });
    else if (item.namehost) namehosts.push({ namehost: item.namehost });
    else if (item.locality) localities.push({ locality: item.locality });
    else if (item.subAdminArea)
      subAdminAreas.push({ subAdminArea: item.subAdminArea });
    else if (item.operador) operadores.push({ operador: item.operador });
    else if (item.cellid) cellids.push({ Ci: item.cellid });
  });

  if (networkTypes.length == 0)
    networkTypes.push({ networkType: { $regex: new RegExp("", "i") } });
  if (subAdminAreas.length == 0)
    subAdminAreas.push({ subAdminArea: { $regex: new RegExp("", "i") } });
  if (localities.length == 0)
    localities.push({ locality: { $regex: new RegExp("", "i") } });
  if (namehosts.length == 0)
    namehosts.push({ namehost: { $regex: new RegExp("", "i") } });
  if (operadores.length == 0)
    operadores.push({ operador: { $regex: new RegExp("", "i") } });
  if (cellids.length == 0) cellids.push({ Ci: { $type: 16 } });

  AppPingTutela.aggregate([
    {
      $match: {
        $and: [
          { categoria: "MOBILE" },
          { fecha: { $gte: desde, $lte: hasta } },
          { $or: namehosts },
          { $or: localities },
          { $or: subAdminAreas },
          { $or: networkTypes },
          { $or: operadores },
          { $or: cellids },
        ],
      },
    },
    {
      $group: {
        _id: {
          operador: "$operador",
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }

    const sortFecha = orderBy(datos, "_id.fecha", "asc");
    const groupByOperador = groupBy(sortFecha, "_id.operador");
    var data = [];
    forEach(groupByOperador, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el._id.fecha });
      });
      data.push({ name: item[0]._id.operador, series });
    });

    const sortName = sortBy(data, "name");
    res.status(200).json({ ok: true, data: sortName });
  });
});

// ====================================
// Get test province TUTELA
// ====================================
app.get("/provincia/tutela", (req, res) => {
  const dep = req.query.dep;
  AppPingTutela.aggregate([
    { $match: { adminArea: { $regex: new RegExp(dep, "i") } } },
    { $sort: { subAdminArea: -1 } },
    { $group: { _id: { provincia: "$subAdminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.subAdminArea", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get test departament TUTELA
// ====================================
app.get("/departamento/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $sort: { adminArea: -1 } },
    { $group: { _id: { departamento: "$adminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.adminArea", "asc");
    const datos = map(_datosOrdenados, (item) => {
      return { nombre: item._id.departamento };
    });
    res.status(200).json({ ok: true, data: datos });
  });
});

// ====================================
// Get test Locality
// ====================================
app.get("/localidad/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $group: { _id: { localidad: "$locality" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    var localidades = map(resp, (el) => {
      return { localidad: el._id.localidad };
    });
    const _localidades = orderBy(localidades, "localidad", "asc");
    res.status(200).json({ ok: true, data: _localidades });
  });
});

// ====================================
// obtener Locality by AdminArea y SubAdminArea
// ====================================
app.get("/distritos/tutela", (req, res) => {
  const adminArea = req.query.adminArea;
  const subAdminArea = req.query.subAdminArea;
  AppPingTutela.aggregate([
    { $match: { adminArea, subAdminArea } },
    { $group: { _id: { localidad: "$locality" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    var localidades = map(resp, (el) => {
      return { nombre: el._id.localidad };
    });
    const _localidades = orderBy(localidades, "localidad", "asc");
    res.status(200).json({ ok: true, data: _localidades });
  });
});

// ====================================
// Obtener datos de medicion por distrito
// TUTELA
// ====================================
app.get("/mediciones/distrito/tutela/", (req, res) => {
  const dep = req.query.dep;
  const prov = req.query.prov;
  const dist = req.query.dist;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  AppPingTutela.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
        operador: "Claro",
        adminArea: dep,
        subAdminArea: prov,
        locality: dist,
      },
    },
    {
      $lookup: {
        from: "cellid_4G",
        localField: "Ci",
        foreignField: "CELL_ID",
        as: "cellid4G",
      },
    },
    {
      $group: {
        _id: {
          latitud: "$latitud",
          longitud: "$Longitud",
          nodeName: "$cellid4G.MBTS_NAME",
          nodeNameLat: "$cellid4G.LATITUD",
          nodeNameLng: "$cellid4G.LONGITUD",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, resp) => {
    const datos = map(resp, (item) => {
      return {
        lat: item._id.latitud,
        lng: item._id.longitud,
        nodeName: item._id.nodeName[0],
        nodeNameLat: item._id.nodeNameLat[0],
        nodeNameLng: item._id.nodeNameLng[0],
        avg: item.avg,
      };
    });
    res.status(200).json({ ok: true, data: datos });
  });
});

// ====================================
// Get test operadores
// ====================================
app.get("/operadores/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $sort: { operador: -1 } },
    { $group: { _id: { operador: "$operador" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.operador", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get test netwrok type
// ====================================
app.get("/redmovil/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $group: { _id: { tipoRed: "$networkType" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.tipoRed", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get CELL ID
// ====================================
app.get("/cellid/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $match: { Ci: { $ne: 0 } } },
    { $group: { _id: { cellid: "$Ci" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    var cellids = map(resp, (el) => {
      return { cellid: el._id.cellid };
    });
    const _datosOrdenados = orderBy(cellids, "cellid", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get latencia OPENSIGNAL general por Servidor
// ====================================
app.get("/opensignal", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const namehost =
    req.query.url.toLowerCase() != "todos"
      ? req.query.url
      : { $regex: new RegExp("", "i") };
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
        namehost,
      },
    },
    {
      $group: {
        _id: {
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
          operador: "$operador",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    var datosOrdenados = map(datos, (el) => {
      return { fecha: el._id.fecha, operador: el._id.operador, avg: el.avg };
    });
    const _datosOrdenados = orderBy(datosOrdenados, "fecha", "asc");
    const groupByOperador = groupBy(_datosOrdenados, "operador");
    var data = [];
    forEach(groupByOperador, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el.fecha });
      });
      data.push({ name: item[0].operador, series });
    });
    const sortName = sortBy(data, "name");
    res.status(200).json({ ok: true, data: sortName });
  });
});

// ====================================
// Get latencia de HOST OPENSIGNAL por operador
// ====================================
app.get("/opensignal/host", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const operador = req.query.operador;
  const namehost =
    req.query.server.toLowerCase() != "todos"
      ? req.query.server
      : { $regex: new RegExp("", "i") };
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
        networkType: "LTE",
        operador: { $regex: new RegExp(operador, "i") },
        namehost,
      },
    },
    {
      $group: {
        _id: {
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
          host: "$host",
        },
        count: { $sum: 1 },
        max: { $max: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    var _datos = map(datos, (el) => {
      return {
        fecha: el._id.fecha,
        host: el._id.host,
        count: el.count,
        maxAvg: el.max,
      };
    });
    const _ordenar = orderBy(_datos, "fecha", "asc");
    return res.status(200).json({ ok: true, datos: _ordenar });
  });
});

// ====================================
// Obtener latencia por filtro
// ====================================
app.post("/opensignal/filtro", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const body = req.body;
  var namehosts = [];
  var localities = [];
  var networkTypes = [];
  var adminAreas = [];
  var operadores = [];
  var cellids = [];

  body.forEach((item, index) => {
    if (item.networkType) networkTypes.push({ networkType: item.networkType });
    else if (item.namehost) namehosts.push({ namehost: item.namehost });
    else if (item.locality) localities.push({ locality: item.locality });
    else if (item.adminArea) adminAreas.push({ adminArea: item.adminArea });
    else if (item.operador) operadores.push({ operador: item.operador });
    else if (item.cellid) cellids.push({ Ci: item.cellid });
  });

  if (networkTypes.length == 0)
    networkTypes.push({ networkType: { $regex: new RegExp("", "i") } });
  if (adminAreas.length == 0)
    adminAreas.push({ adminArea: { $regex: new RegExp("", "i") } });
  if (localities.length == 0)
    localities.push({ locality: { $regex: new RegExp("", "i") } });
  if (namehosts.length == 0)
    namehosts.push({ namehost: { $regex: new RegExp("", "i") } });
  if (operadores.length == 0)
    operadores.push({ operador: { $regex: new RegExp("", "i") } });
  if (cellids.length == 0) cellids.push({ Ci: { $type: 16 } });

  AppPingOpensignal.aggregate([
    {
      $match: {
        $and: [
          { categoria: "MOBILE" },
          { fecha: { $gte: desde, $lte: hasta } },
          { $or: namehosts },
          { $or: localities },
          { $or: adminAreas },
          { $or: networkTypes },
          { $or: operadores },
          { $or: cellids },
        ],
      },
    },
    {
      $group: {
        _id: {
          operador: "$operador",
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }

    const sortFecha = orderBy(datos, "_id.fecha", "asc");
    const groupByOperador = groupBy(sortFecha, "_id.operador");
    var data = [];
    forEach(groupByOperador, (item) => {
      var series = [];
      forEach(item, (el) => {
        series.push({ value: el.avg, name: el._id.fecha });
      });
      data.push({ name: item[0]._id.operador, series });
    });

    const sortName = sortBy(data, "name");
    res.status(200).json({ ok: true, data: sortName });
  });
});

// ====================================
// Get test departament OPENSIGNAL
// ====================================
app.get("/departamento/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $sort: { adminArea: -1 } },
    { $group: { _id: { departamento: "$adminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.adminArea", "asc");
    const datos = map(_datosOrdenados, (item) => {
      return { nombre: item._id.departamento };
    });
    res.status(200).json({ ok: true, data: datos });
  });
});

// ====================================
// Get test operadores
// ====================================
app.get("/operadores/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $sort: { operador: -1 } },
    { $group: { _id: { operador: "$operador" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.operador", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get test province OPENSIGNAL
// ====================================
app.get("/provincia/opensignal", (req, res) => {
  const dep = req.query.dep;
  AppPingOpensignal.aggregate([
    { $match: { adminArea: { $regex: new RegExp(dep, "i") } } },
    { $sort: { subAdminArea: -1 } },
    { $group: { _id: { provincia: "$subAdminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.subAdminArea", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get test Locality
// ====================================
app.get("/localidad/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $group: { _id: { localidad: "$locality" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    var localidades = map(resp, (el) => {
      return { localidad: el._id.localidad };
    });
    const _localidades = orderBy(localidades, "localidad", "asc");
    res.status(200).json({ ok: true, data: _localidades });
  });
});

// ====================================
// Get test netwrok type
// ====================================
app.get("/redmovil/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $group: { _id: { tipoRed: "$networkType" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.tipoRed", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Get CELL ID
// ====================================
app.get("/cellid/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $match: { Ci: { $ne: 0 } } },
    { $group: { _id: { cellid: "$Ci" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    var cellids = map(resp, (el) => {
      return { cellid: el._id.cellid };
    });
    const _datosOrdenados = orderBy(cellids, "cellid", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
  });
});

// ====================================
// Obtener latencias de AMAZON
// los agrupa por IP, Region y Operador
// ====================================
app.get("/amazon/porip/:region/:categoria", (req, res) => {
  const region = req.params.region;
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const categoria = req.params.categoria;
  AppPingAmazon.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        region: region,
        categoria: { $regex: new RegExp(categoria, "i") },
      },
    },
    {
      $group: {
        _id: {
          operador: "$operador",
          ip: "$host",
          region: "$region",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    datos = orderBy(datos, ["_id.ip", "_id.operador"], ["asc", "asc"]);
    res.json({ datos });
  });
});

// ====================================
// Obtener historico de latencias de AMAZON
// los agrupa por Region y Operador
// ====================================
app.get("/amazon/:categoria/:operador", (req, res) => {
  const desde = req.query.desde;
  const hasta = req.query.hasta;
  const operador = req.params.operador;
  const categoria = req.params.categoria;
  AppPingAmazon.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        operador: { $regex: new RegExp(operador, "i") },
        categoria: { $regex: new RegExp(categoria, "i") },
      },
    },
    {
      $lookup: {
        from: "regionesamazon",
        localField: "region",
        foreignField: "code",
        as: "region",
      },
    },
    {
      $group: {
        _id: {
          fecha: {
            $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$fecha" } },
          },
          region: "$region.full_name",
        },
        avg: { $avg: "$avg" },
      },
    },
  ]).exec((err, datos) => {
    const orderByFecha = orderBy(datos, ["_id.fecha"], ["asc"]);
    const groupByRegion = groupBy(orderByFecha, "_id.region[0]");
    var datos = map(groupByRegion, (dataRegion) => {
      var series = map(dataRegion, (obj) => {
        return { value: obj.avg, name: obj._id.fecha };
      });
      return { name: dataRegion[0]._id.region[0], series };
    });

    res.json({ datos: orderBy(datos, ["name"], ["asc"]) });
  });
});

module.exports = app;
