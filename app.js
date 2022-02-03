require('dotenv').config();
const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
require('./helpers/passport')

const app = express();
const mongoDb = process.env.DB_URL;
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');



app.use('/posts', postRouter);
app.use('/auth', authRouter);

app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);
// app.use('/comments', commentRouter);

app.listen(process.env.PORT, () => console.log(`Server listening on ${process.env.PORT}`))
