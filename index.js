const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// database connection 
const db = require('./database/db');
// passport strategy
const passport = require('./passport/passport');
// les routes
const users = require('./routes/users');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/users', users);

app.listen(process.env.port || 4000, function () {
    console.log('Backend server start on port 4000');
});
