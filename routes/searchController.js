const express = require('express');
const router = express.Router();

// input imports + router post/get here
const getClass = require('../model/getClass');

router.get('/getClass', (req, res) => {
    getClass(req.query.className)
        .then(doc => res.send(doc))
});
// end

module.exports = router;