const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const velocidadNperfSchema = new Schema(
  {
    claro: { type: Number },
    bitel: { type: Number },
    movistar: { type: Number },
    entel: { type: Number },
    pruebas: { type: Number },
    fecha_ingreso: { type: Date },
    tipo: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  },
  { collection: "downloads_nperf" }
);

module.exports = mongoose.model("VelocidadNperf", velocidadNperfSchema);
