const express = require('express');
const router = express.Router();

// input imports + router post/get here
const getClass = require('../model/getClass');
const getClassSnapshot = require('../model/getClassSnapshot');
const getCommunity = require('../model/getCommunity');
const getCommunityByCat = require('../model/getCommunityByCat');
const getCommunitySnapshot = require('../model/getCommunitySnapshot');
const getMajorSnapshot = require('../model/getMajorSnapshot');

router.get('/getClass', (req, res) => {
    getClass(req.query.className)
        .then(doc => res.send(doc))
});

router.get('/getClassSnapshot', (req, res) => {
    getClassSnapshot()
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

router.get('/getCommunitySnapshot', (req, res) => {
    getCommunitySnapshot()
        .then(doc => res.send(doc))
});

router.get('/getMajorSnapshot', (req, res) => {
    getMajorSnapshot()
        .then(doc => res.send(doc))
});
// end

module.exports = router;