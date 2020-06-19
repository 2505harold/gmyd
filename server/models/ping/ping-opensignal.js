const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pingOpenSignalSchema = new Schema(
  {
    min: { type: String },
    max: { type: String },
    avg: { type: String },
    stdev: { type: String },
    packetloss: { type: String },
    host: { type: String },
    alive: { type: Boolean },
    fecha: { type: Date },
    operador: { type: String },
  },
  { collection: "ping_opensignal" }
);

module.exports = mongoose.model("PingOpenSignal", pingOpenSignalSchema);
