const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: {
    type: String,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);
