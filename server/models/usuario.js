const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  correo: { type: String },
  password: { type: String },
  nombre: { type: String },
  apellido: { type: String },
  departamento: { type: String },
  provincia: { type: String },
  distrito: { type: String },
  rol: { type: String },
  fecha_creacion: { type: String, default: new Date() },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
