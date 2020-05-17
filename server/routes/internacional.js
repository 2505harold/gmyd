const express = require("express");
const LinkInternacional = require("../models/links-internacionales");
const app = express();

// ====================================
// guardar enlace internacional
// ====================================
app.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  const link = new LinkInternacional(body);

  link.save((err, linkGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar link",
        errors: err,
      });
    }
    return res.status(200).json({
      ok: true,
      link: linkGuardado,
    });
  });
});

// ====================================
// actualizar link
// ====================================
app.put("/:id", (req, res) => {
  const id = req.params.id;
  LinkInternacional.findById(id, (err, link) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar enlace",
        error: err,
      });
    }

    if (!link) {
      return res.status(400).json({
        ok: false,
        mensaje: "El link con ID " + id + " no existe",
        error: err,
      });
    }

    link.equipo = req.body.equipo;
    link.proveedor = req.body.proveedor;
    link.delayves = req.body.delayves;
    link.delaypolo = req.body.delaypolo;

    link.save((err, linkAactualizado) => {
      return res.status(200).json({
        ok: true,
        link: linkAactualizado,
      });
    });
  });
});

// ====================================
// mostrar enlaces internacionales
// ====================================
app.get("/", (req, res) => {
  LinkInternacional.find({}).exec((err, datos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Ocurrio un error con obtener la lista",
        error: err,
      });
    }
    return res.status(200).json({
      ok: true,
      enlaces: datos,
    });
  });
});

// ====================================
// Eliminar enlace internacional
// ====================================
app.delete("/:id", (req, res) => {
  const id = req.params.id;
  LinkInternacional.findByIdAndDelete(id, (err, linkEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al eliminar enlace",
        error: err,
      });
    }
    if (!linkEliminado) {
      return res.status(400).json({
        ok: false,
        mensaje: "el link con ID : " + id + " no existe",
        error: err,
      });
    }
    res.status(200).json({
      ok: true,
      enlace: linkEliminado,
    });
  });
});

module.exports = app;
