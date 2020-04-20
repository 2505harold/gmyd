const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prefixAmazonSchema = new Schema(
  {
    ip_prefix: { type: String },
    region: { type: String },
    service: { type: String },
    network_border_group: { type: String },
  },
  { collection: "ipsamazon" }
);

module.exports = mongoose.model("IpsAmazon", prefixAmazonSchema);
