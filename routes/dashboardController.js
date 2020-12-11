const express = require('express');
const router = express.Router();
const adminEmail = require('../model/getAdminEmail');
const addClass = require('../model/addClass')
const addCommunity = require('../model/addCommunity')
// input imports + router post/get here

router.post('/getAdminEmail', (req, res) => {
    adminEmail(req.body.mail);
});

router.post('/addClass',(req, res) => {
   addClass(req.body.className, req.body.inviteURL, req.body.profName, req.body.quarter, req.body.year)
});

router.post('/addCommunity',(req, res) => {
    addCommunity(req.body.contact, req.body.name, req.body.inviteLink, req.body.org_type, req.body.category, req.body.social_media, req.body.description)
});


// end

module.exports = router;