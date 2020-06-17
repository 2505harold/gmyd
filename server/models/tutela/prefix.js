const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ipsTutelaSchema = new Schema(
  {
    ip: { type: String },
    tipo: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Usuario" },
    fecha: { type: String },
  },
  { collection: "ipstutela" }
);

module.exports = mongoose.model("IpsTutela", ipsTutelaSchema);
