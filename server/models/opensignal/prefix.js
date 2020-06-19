const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ipsOpensignalSchema = new Schema(
  {
    ip: { type: String },
    tipo: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Usuario" },
    fecha: { type: String },
  },
  { collection: "ipsopensignal" }
);

module.exports = mongoose.model("IpsOpenSignal", ipsOpensignalSchema);
