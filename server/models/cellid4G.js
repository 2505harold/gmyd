const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cellid4GSchema = new Schema({
  cell_id: { type: String },
  mbts_name: { type: String },
  enodob_name: { type: String },
  enodob_address: { type: String },
  departamento: { type: String },
  provincia: { type: String },
  distrito: { type: String },
  sub_region: { type: String },
});

module.exports = mongoose.model("CellId4G", cellid4GSchema);
