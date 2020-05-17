const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinksInternSchema = new Schema(
  {
    equipo: { type: String },
    proveedor: { type: String },
    delayves: { type: String },
    delaypolo: { type: String },
  },
  { collection: "links_internacionales" }
);

module.exports = mongoose.model("LinksIntern", LinksInternSchema);
