const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const pnManager = require('./pubnub/pubnub-manager');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setup and connect to DB
const db = require('./config/keys').mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('***      MongoDB Connected      ***');
  })
  .catch(err => console.log(`Error connecting to DB: ${err}`));

// Passport
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);

pnManager.init();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`*** Server running on port ${port} ***`));
