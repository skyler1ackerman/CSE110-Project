const express = require('express');
const router = express.Router();

const adminEmail = require('../model/getAdminEmail');
// input imports + router post/get here

router.post('/getAdminEmail', (req, res) => {
    adminEmail(req.body.mail);
});

// end

module.exports = router;