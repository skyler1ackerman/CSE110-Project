const express = require('express');
const router = express.Router();

const setNewReport = require('../model/setNewReport');

router.post('/setNewReport', (req, res) => {
    setNewReport(req.body.reportRef, req.body.community_or_class_name, req.body.discord_link, req.body.report_contact_email, req.body.user_fullname, req.body.report_reason);
});

module.exports = router;