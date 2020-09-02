const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pingSchema = new Schema(
  {
    min: { type: String },
    max: { type: String },
    avg: { type: String },
    host: { type: String },
    fecha: { type: String },
    namehost: { type: String },
    categoria: { type: String },
    operador: { type: String },
    latitud: { type: String },
    longitud: { type: String },
  },
  { collection: "nping_tutela" }
);

module.exports = mongoose.model("PingTutela", pingSchema);
