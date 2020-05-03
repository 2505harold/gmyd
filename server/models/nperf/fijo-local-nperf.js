const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fijoLocalNperfSchema = new Schema(
  {
    movistar: { type: Number },
    claro: { type: Number },
    americatel_peru: { type: Number },
    winet_telecom: { type: Number },
    claro_movil: { type: Number },
    pruebas: { type: Number },
    fecha_ingreso: { type: Date },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  },
  { collection: "fijo_local_nperf" }
);

module.exports = mongoose.model("FijoLocalNperf", fijoLocalNperfSchema);
