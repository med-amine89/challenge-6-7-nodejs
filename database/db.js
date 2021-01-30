const mongoose = require('mongoose');

const connect = mongoose.connect('mongodb://localhost:27017/aminos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(
  () => { console.log("successfully connection to database") },
  err => { console.log("Connect with error") }
);

module.exports = connect