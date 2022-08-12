const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const ApiError = require('../errors/ApiError');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => next(ApiError.NotFoundError('Адреса не существует')));

module.exports = router;
