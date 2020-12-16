const express = require("express");
const app = express();
const AppPingTutela = require("../models/pingApp/ping-tutela");
const AppPingOpensignal = require("../models/pingApp/ping-opensignal");
const { groupBy, map, forEach, orderBy, sortBy } = require("lodash");
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

  AppPingTutela.aggregate([
    {
      $match: {
        $and: [
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
// Get test province
// ====================================
app.get("/provincia/tutela", (req, res) => {
  AppPingTutela.aggregate([
    { $sort: { adminArea: -1 } },
    { $group: { _id: { provincia: "$adminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.adminArea", "asc");
    res.status(200).json({ ok: true, data: _datosOrdenados });
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
// Get test province
// ====================================
app.get("/provincia/opensignal", (req, res) => {
  AppPingOpensignal.aggregate([
    { $sort: { adminArea: -1 } },
    { $group: { _id: { provincia: "$adminArea" }, count: { $sum: 1 } } },
  ]).exec((err, resp) => {
    const _datosOrdenados = orderBy(resp, "_id.adminArea", "asc");
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

module.exports = app;
