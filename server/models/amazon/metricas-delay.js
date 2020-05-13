const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const delaySchema = new Schema(
  {
    fecha: { type: Date },
    pc: { type: Schema.Types.ObjectId, ref: "PcsAmazon" },
    delay: { type: Number },
  },
  { collection: "delay_amazon" }
);

module.exports = mongoose.model("DelayAmazon", delaySchema);
