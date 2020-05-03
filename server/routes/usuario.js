const express = require("express");
const Usuario = require("../models/usuario");
const app = express();

// ====================================
// Crear nuevo usuario
// ====================================
app.post("/", (req, res) => {
  var body = req.body;
  body.password = bcrypt.hashSync(body.password);
  const usuario = new Usuario({
    correo: body.correo,
    password: body.password,
    nombre: body.nombre,
    apellido: body.apellido,
    departamento: body.departamento,
    provincia: body.provincia,
    distrito: body.distrito,
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar usuario",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      usuario: usuarioGuardado,
    });
  });
});

// ====================================
// Obtener el grupo departamentos total ingresados
// ====================================
app.get("/departamentos", (req, res) => {
  Usuario.aggregate([
    {
      $group: {
        _id: "$departamento",
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((err, departamentos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      departamentos,
    });
  });
});

// ====================================
// Obtener el grupo de prov x dep ingresados
// ====================================
app.get("/provincias", (req, res) => {
  const dep = req.query.dep;
  console.log(dep);
  Usuario.aggregate([
    {
      $match: { departamento: dep },
    },
    {
      $group: {
        _id: "$provincia",
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((err, provincias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      provincias,
    });
  });
});

// ====================================
// Obtener el grupo de dist x prov ingresados
// ====================================
app.get("/distritos", (req, res) => {
  const prov = req.query.prov;
  const dep = req.query.dep;
  Usuario.aggregate([
    {
      $match: { $and: [{ departamento: dep }, { provincia: prov }] },
    },
    {
      $group: {
        _id: "$distrito",
        cantidad: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).exec((err, distrito) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      distrito,
    });
  });
});

module.exports = app;
