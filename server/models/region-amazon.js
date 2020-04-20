const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regionAmazonSchema = new Schema(
  {
    name: { type: String },
    full_name: { type: String },
    code: { type: String },
    public: { type: Boolean },
    zones: { type: Array },
  },
  { collection: "regionesamazon" }
);

module.exports = mongoose.model("RegionesAmazon", regionAmazonSchema);
