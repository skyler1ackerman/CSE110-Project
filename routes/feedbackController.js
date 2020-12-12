const express = require('express');
const router = express.Router();

// input imports + router post/get here
const sendFeedbackVerifed = require('../model/sendFeedbackVerifed');
const sendFeedbackUnverifed = require('../model/sendFeedbackUnverifed');

router.post('/sendFeedbackVerifed', (req, res) => {
    sendFeedbackVerifed(req.body.email, req.body.fullname, req.body.issue_type, req.body.explanation, req.body.time);
});

router.post('/sendFeedbackUnverifed', (req, res) => {
    sendFeedbackUnverifed(req.body.email, req.body.fullname, req.body.issue_type, req.body.explanation, req.body.time);
});

// end

module.exports = router;