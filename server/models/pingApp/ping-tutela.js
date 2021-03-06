const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppingSchema = new Schema(
  {
    ci: { type: Number },
    cid: { type: Number },
    lac: { type: Number },
    longitud: { type: String },
    mcc: { type: Number },
    mnc: { type: Number },
    pci: { type: Number },
    psc: { type: Number },
    rsrp: { type: Number },
    rsrq: { type: Number },
    rssi: { type: Number },
    tac: { type: Number },
    address: { type: String },
    adminArea: { type: String },
    avg: { type: Number },
    categoria: { type: String },
    country: { type: String },
    fecha: { type: String },
    host: { type: String },
    latitud: { type: String },
    locality: { type: String },
    max: { type: Number },
    min: { type: Number },
    nameHost: { type: String },
    networkType: { type: String },
    operador: { type: String },
    postal: { type: String },
    subAdminArea: { type: String },
    user: { type: String },
  },
  { collection: "app_ping_tutela" }
);

module.exports = mongoose.model("AppPingTutela", AppingSchema);
