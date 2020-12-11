const express = require('express');
const router = express.Router();

// input imports + router post/get here

const getCommunityName = require('../model/getCommunityName');
const setCommunity = require('../model/setCommunity');
const setClassServerRequest = require('../model/setClassServerRequest')


router.get('/getCommunityName', (req, res) => {
    getCommunityName()
    .then(doc => res.send(doc))
});

router.post('/setCommunityRequest', (req, res) => {
    setCommunity(req.body.contacEmail, req.body.category, req.body.serverName, req.body.desc, req.body.link, req.body.type, req.body.socialMedia);
});

router.post('/setClassServerRequest', (req, res) => {
    setClassServerRequest(req.body.user_email, req.body.class_name, req.body.invite_URL, req.body.prof_Name, req.body.quarter, req.body.year);
});


// end

module.exports = router;