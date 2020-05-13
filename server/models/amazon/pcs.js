const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pcsAmazonSchema = new Schema(
  {
    ip: { type: String },
    dns: { type: String },
    region: { type: String },
    fecha: { type: String },
    img: { type: String },
  },
  { collection: "pcs_amazon" }
);

module.exports = mongoose.model("PcsAmazon", pcsAmazonSchema);
