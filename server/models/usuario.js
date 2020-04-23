const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  correo: { type: String, unique: true },
  password: { type: String },
  nombre: { type: String },
  apellido: { type: String },
  departamento: { type: String },
  provincia: { type: String },
  distrito: { type: String },
  rol: { type: String },
  fecha_creacion: { type: String, default: new Date() },
});

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

module.exports = mongoose.model("Usuario", usuarioSchema);
