const express = require("express");
const Nperf = require("../models/nperf/metricas-nperf");
const velocidadesNperf = require("../models/nperf/velocidad-nperf");
const FijoLocalNperf = require("../models/nperf/fijo-local-nperf");
const FijoNacionalNperf = require("../models/nperf/fijo-nacional-nperf");
const app = express();

// ====================================
// Guardar metricas
// ====================================
app.post("/", (req, res) => {
  let nperf = new Nperf(req.body);
  nperf.save((err, metricaGuardada) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metrica",
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
// Guardar metricas de velocidad
// ====================================
app.post("/velocidad", (req, res) => {
  let body = req.body;

  let nperf = new velocidadesNperf(req.body);
  nperf.save((err, datoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metricas",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      metrica: datoGuardado,
    });
  });
});

// ====================================
// Guardar metricas nperf fijo nacional
// ====================================
app.post("/fijo/nacional", (req, res) => {
  let body = req.body;
  let nperf = new FijoNacionalNperf(body);
  nperf.save((err, datoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metricas",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      metrica: datoGuardado,
    });
  });
});

// ====================================
// Guardar metricas nperf fijo local
// ====================================
app.post("/fijo/local", (req, res) => {
  let body = req.body;
  let nperf = new FijoLocalNperf(body);
  nperf.save((err, datoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear metricas",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      metrica: datoGuardado,
    });
  });
});

// ====================================
// Guardar metricas nperf fijo local
// ====================================
app.post("/fijo", (req, res) => {
  let body = req.body;
  const local = body.local;
  const nacional = body.nacional;
  Promise.all([guardarFijoLocal(local), guardarFijoNacional(nacional)])
    .then((resp) => {
      res.status(200).json({
        ok: true,
        local: resp[0],
        nacional: resp[1],
      });
    })
    .catch((err) => {
      return res.status(400).json({
        ok: false,
        mensaje: "Ocurrio un error al guardar los datos",
        error: err,
      });
    });
});

function guardarFijoLocal(datos) {
  return new Promise((resolve, reject) => {
    let nperf = new FijoLocalNperf(datos);
    nperf.save((err, datoGuardado) => {
      if (err) {
        reject("Error al guardar los datos");
      } else {
        resolve(datoGuardado);
      }
    });
  });
}

function guardarFijoNacional(datos) {
  return new Promise((resolve, reject) => {
    let nperf = new FijoNacionalNperf(datos);
    nperf.save((err, datoGuardado) => {
      if (err) {
        reject("Error al guardar los datos");
      } else {
        resolve(datoGuardado);
      }
    });
  });
}

// ====================================
// Obtener metricas : -1 Mayor a Menor
// ====================================
app.get("/", (req, res) => {
  Nperf.find({})
    .sort({ fecha_ingreso: "asc" })
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        metricas,
      });
    });
});

// ====================================
// Obtener metricas de velocidades: -1 Mayor a Menor
// ====================================
app.get("/velocidades/movil", (req, res) => {
  velocidadesNperf
    .find({ tipo: "Movil" })
    .sort({ fecha_ingreso: "asc" })
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        metricas,
      });
    });
});

// ====================================
// Obtener metricas fijo nacional: -1 Mayor a Menor
// ====================================
app.get("/velocidades/fijo/nacional", (req, res) => {
  FijoNacionalNperf.find({})
    .sort({ fecha_ingreso: "asc" })
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        metricas,
      });
    });
});

// ====================================
// Obtener metricas fijo local: -1 Mayor a Menor
// ====================================
app.get("/velocidades/fijo/local", (req, res) => {
  const id = req.query.id;
  let find = {};
  if (id) {
    find = { usuario: id };
  }
  FijoLocalNperf.find(find)
    .sort({ fecha_ingreso: "asc" })
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }
      return res.status(200).json({
        ok: true,
        metricas,
      });
    });
});

// ====================================
// Obtener metricas with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  Nperf.find({})
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      Nperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

// ====================================
// Obtener metricas velocidades with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/velocidades/movil/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  velocidadesNperf
    .find({ tipo: "Movil" })
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      velocidadesNperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

// ====================================
// Obtener metricas fijo local with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/velocidades/fijo/local/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  FijoLocalNperf.find({})
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      FijoLocalNperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

// ====================================
// Obtener metricas fijo nacional with sort by campo: -1 Mayor a Menor
// ====================================
app.get("/velocidades/fijo/nacional/sorter/:campo/:sort", (req, res) => {
  var campo = req.params.campo;
  var sort = req.params.sort;
  var limite = req.query.limite || 10;
  var desde = req.query.desde || 0;
  var sorter = {};
  switch (campo) {
    case "fecha_ingreso":
      sorter = { fecha_ingreso: sort };
      break;
  }

  FijoNacionalNperf.find({})
    .sort(sorter)
    .skip(Number(desde))
    .limit(Number(limite))
    .populate("usuario", "nombre")
    .exec((err, metricas) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Ocurrio un error con obtener la lista",
          error: err,
        });
      }

      FijoNacionalNperf.countDocuments({}, (err, cantidad) => {
        return res.status(200).json({
          ok: true,
          total: cantidad,
          metricas,
        });
      });
    });
});

module.exports = app;
