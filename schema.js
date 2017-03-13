var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema ({
  shortUrl: String,
  longUrl: String
});

var UrlModel = mongoose.model('UrlModel', UrlSchema);

module.exports = UrlModel;
