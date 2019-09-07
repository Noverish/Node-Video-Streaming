const { Router } = require('express');
const explorer = require('./explorer');
const login = require('./login');

const router = Router();

router.use('/login', login);
router.use('/', explorer);

module.exports = router;
