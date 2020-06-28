const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fijoNacionalNperfSchema = new Schema(
  {
    movistar: { type: Number },
    claro: { type: Number },
    claro_movil: { type: Number },
    americatel_peru: { type: Number },
    movistar_movil: { type: Number },
    winet_telecom: { type: Number },
    pruebas: { type: Number },
    fecha_ingreso: { type: Date },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  },
  { collection: "fijo_nacional_nperf" }
);

module.exports = mongoose.model("FijoNacionalNperf", fijoNacionalNperfSchema);
