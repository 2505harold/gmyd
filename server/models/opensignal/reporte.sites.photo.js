const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fotoReporteSiteOpensignalSchema = new Schema(
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
  { collection: "foto_reporte_delay_semanal_sites_Opensignal" }
);

module.exports = mongoose.model(
  "FotoReportLatenciaSiteOpensignal",
  fotoReporteSiteOpensignalSchema
);
