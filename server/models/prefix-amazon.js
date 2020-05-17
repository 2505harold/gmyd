const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prefixAmazonSchema = new Schema(
  {
    ip_prefix: { type: String },
    region: { type: String },
    service: { type: String },
    network_border_group: { type: String },
    link_internacional: { type: Schema.Types.ObjectId, ref: "LinksIntern" },
    estado: { type: String },
  },
  { collection: "ipsamazon" }
);

module.exports = mongoose.model("IpsAmazon", prefixAmazonSchema);
