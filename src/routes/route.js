const express = require('express');

const router = express.Router();
const urlController = require('../controllers/urlController.js')

router.post('/url/shorten', urlController.shortUrl);
router.get('/:shortUrl', urlController.getUrl);

module.exports = router;