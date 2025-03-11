const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth")

/* GET home page. */
router.get('/', auth, (req, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
