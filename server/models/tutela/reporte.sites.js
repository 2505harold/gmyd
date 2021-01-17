const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reporteSiteTutelaSchema = new Schema(
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
  { collection: "reporte_delay_semanal_sites_tutela" }
);

module.exports = mongoose.model(
  "ReportLatenciaSiteTutela",
  reporteSiteTutelaSchema
);
