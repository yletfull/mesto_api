require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const whitelist = ['http://localhost:8080'];
const corsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const { requestLogger, errorLogger } = require(path.join(__dirname, './middlewares/logger'));
const auth = require(path.join(__dirname, './middlewares/auth'));
const { register, login } = require(path.join(__dirname, './controllers/users'));
const cards = require(path.join(__dirname, './routes/cards'));
const users = require(path.join(__dirname, './routes/users'));

const {
  resourseError, timeLog, errorProcessor,
} = require(path.join(__dirname, '/routes/helpers.js'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use('', timeLog);
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    about: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
  }),
}), register);
app.use('',
  celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required().pattern(/^Bearer\s[^\s]+$/),
    }).unknown(true),
  }),
  auth);
app.use('', cards);
app.use('', users);
app.use(errorLogger);
app.use(errors());
app.use('', resourseError);
app.use('', errorProcessor);
module.exports = { app };
