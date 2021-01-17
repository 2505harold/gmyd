const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reporteSiteOpensignalSchema = new Schema(
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
  { collection: "reporte_delay_semanal_sites_opensignal" }
);

module.exports = mongoose.model(
  "ReportLatenciaSiteOpensignal",
  reporteSiteOpensignalSchema
);
