const router = require('express').Router();
const path = require('path');
const { celebrate, Joi } = require('celebrate');

const {
  getUsersList, getUser, updateUser, updateAvatar,
} = require(path.join(__dirname, '../controllers/users'));

router.get('/users', getUsersList);

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/),
  }),
}), updateAvatar);

module.exports = router;
