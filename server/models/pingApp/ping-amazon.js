const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppingAmazonSchema = new Schema(
  {
    ci: { type: Number },
    cid: { type: Number },
    lac: { type: Number },
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
    longitud: { type: String },
    locality: { type: String },
    max: { type: Number },
    min: { type: Number },
    nameHost: { type: String },
    networkType: { type: String },
    operador: { type: String },
    postal: { type: String },
    region: { type: String },
    subAdminArea: { type: String },
    user: { type: String },
  },
  { collection: "app_ping_amazon" }
);

module.exports = mongoose.model("AppPingAmazon", AppingAmazonSchema);
