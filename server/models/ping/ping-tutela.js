const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pingSchema = new Schema(
  {
    min: { type: String },
    max: { type: String },
    avg: { type: String },
    stdev: { type: String },
    packetloss: { type: String },
    host: { type: String },
    alive: { type: Boolean },
    fecha: { type: String },
    prefijo: { type: Schema.Types.ObjectId, ref: "IpsTutela" },
    operador: { type: String },
  },
  { collection: "ping_tutela" }
);

module.exports = mongoose.model("PingTutela", pingSchema);
