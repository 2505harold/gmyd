const express = require("express");
const app = express();
const AppPingTutela = require("../models/pingApp/ping-tutela");
const AppPingAmazon = require("../models/pingApp/ping-amazon");
const AppPingOpensignal = require("../models/pingApp/ping-opensignal");
const { groupBy, map, forEach, orderBy, sortBy } = require("lodash");

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
  AppPingOpensignal.aggregate([
    {
      $match: {
        fecha: { $gte: desde, $lte: hasta },
        categoria: "MOBILE",
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
  ]).exec((err, datos) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }

    const sortFecha = orderBy(datos, "fecha", "asc");
    const groupByOperador = groupBy(sortFecha, "operador");
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
