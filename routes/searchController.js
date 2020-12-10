const express = require('express');
const router = express.Router();

// input imports + router post/get here
const getClass = require('../model/getClass');
const getCommunity = require('../model/getCommunity');
const getCommunityByCat = require('../model/getCommunityByCat');

router.get('/getClass', (req, res) => {
    getClass(req.query.className)
        .then(doc => res.send(doc))
});

router.get('/getCommunity', (req, res) => {
    getCommunity(req.query.name)
        .then(doc => res.send(doc))
});

router.get('/getCommunityByCat', (req, res) => {
    getCommunityByCat(req.query.category)
        .then(doc => res.send(doc))
});
// end

module.exports = router;