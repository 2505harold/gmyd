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
    prefijo: { type: Schema.Types.ObjectId, ref: "IpsAmazon" },
    tipo: { type: String },
    categoria: { type: String },
    operador: { type: String },
  },
  { collection: "ping_amazon" }
);

module.exports = mongoose.model("PingAmazon", pingSchema);
