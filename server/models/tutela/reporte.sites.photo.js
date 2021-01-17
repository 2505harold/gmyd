const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fotoReporteSiteTutelaSchema = new Schema(
  {
    nodeName: { type: String },
    departamento: { type: String },
    provincia: { type: String },
    distrito: { type: String },
    region: { type: String },
    subregion: { type: String },
    delayAvg: { type: Number },
    delayMax: { type: Number },
    desde: { type: String },
    hasta: { type: String },
  },
  { collection: "foto_reporte_delay_semanal_sites_tutela" }
);

module.exports = mongoose.model(
  "FotoReportLatenciaSiteTutela",
  fotoReporteSiteTutelaSchema
);
