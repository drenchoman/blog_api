require('dotenv').config();
require('./helpers/passport')

const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const jwt = require('jsonwebtoken');

const app = express();

const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use('/api', apiRouter);


app.listen(process.env.PORT, () => console.log(`Server listening on ${process.env.PORT}`))
