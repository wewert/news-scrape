var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var NoteSchema = new Schema({
  body: String,
  created_time: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
