const express = require('express');
const router = express.Router();

// input imports + router post/get here

const getCommunity = require('../model/getCommunity');
const setCommunity = require('../model/setCommunity');


router.get('/getCommunity', (req, res) => {
    getCommunity()
    .then(doc => res.send(doc))
});

router.post('/setCommunityRequest', (req, res) => {
    setCommunity(req.body.contacEmail, req.body.category, req.body.serverName, req.body.desc, req.body.link, req.body.type, req.body.socialMedia);
});

// end

module.exports = router;