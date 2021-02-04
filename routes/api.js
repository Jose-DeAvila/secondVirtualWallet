const router = require('express').Router();

const apiUserRouter = require('./users');

router.use("/users", apiUserRouter);

module.exports = router;