const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nperfSchema = new Schema(
  {
    downlink_max: { type: String },
    downlink_avg: { type: String },
    uplink_max: { type: String },
    uplink_avg: { type: String },
    latency_min: { type: String },
    latency_avg: { type: String },
    latency_jitter: { type: String },
    navegacion: { type: String },
    streaming: { type: String },
    claro: { type: String },
    bitel: { type: String },
    movistar: { type: String },
    entel: { type: String },
    pruebas: { type: String },
    fecha_ingreso: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario" },
  },
  { collection: "nperf" }
);
module.exports = mongoose.model("Nperf", nperfSchema);
