const express = require('express');
const router = express.Router();
const adminEmail = require('../model/getAdminEmail');
const addClass = require('../model/addClass')
const addCommunity = require('../model/addCommunity')
const getFeedbackSnapshot = require('../model/getFeedbackSnapshot')
const moveFeedback = require('../model/moveFeedback')
const removeData = require('../model/removeData')
const removeClass = require('../model/removeClass')
const getAdminSnapshot = require('../model/getAdminSnapshot')
const getReportSnapshot = require('../model/getReportSnapshot')
const moveReport = require('../model/moveReport')
const getCommRequestSnapshot = require('../model/getCommRequestSnapshot')
const getClassRequestSnapshot = require('../model/getClassRequestSnapshot')
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
router.get('/getFeedbackSnapshot', (req, res) => {
    getFeedbackSnapshot(req.query.path)
        .then(doc => res.send(doc))
});
router.post('/moveFeedback',(req, res) => {
    moveFeedback(req.body.from,req.body.to,req.body.id,req.body.email,req.body.fullname,req.body.issue_type,req.body.explanation,req.body.time)
});

router.post('/removeData',(req, res) => {
    removeData(req.body.reference,req.body.id)
});
router.get('/getAdminSnapshot',(req, res) => {
    getAdminSnapshot().then(doc => res.send(doc))
});
router.get('/getReportSnapshot', (req, res) => {
    getReportSnapshot(req.query.path)
        .then(doc => res.send(doc))
});
router.post('/moveReport',(req, res) => {
    moveReport(req.body.from,req.body.to,req.body.id,req.body.time,req.body.communityOrClassName,req.body.discordLink,req.body.email,req.body.fullname,req.body.reason)
});
router.get('/getCommRequestSnapshot', (req, res) => {
    getCommRequestSnapshot(req.query.path)
        .then(doc => res.send(doc))
});

router.get('/getClassRequestSnapshot', (req, res) => {
    getClassRequestSnapshot(req.query.path)
        .then(doc => res.send(doc))
});


router.post('/removeClass',(req, res) => {
    removeClass(req.body.className,req.body.bid)
});


// end

module.exports = router;