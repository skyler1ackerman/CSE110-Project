const express = require('express');
const router = express.Router();

const getUserName = require('../model/getUserName');
const getUserMajor = require('../model/getUserMajor');
const getUserClasses = require('../model/getUserClasses');
const saveUserProfile = require('../model/saveUserProfile');
const getAdminUser = require('../model/getAdminUser');

router.get('/getUserName', (req, res) => {
    getUserName(req.query.uid)
    .then(doc => res.send(doc))
});

router.get('/getUserMajor', (req, res) => {
    getUserMajor(req.query.uid)
    .then(doc => res.send(doc))
});

router.get('/getUserClasses', (req, res) => {
    getUserClasses(req.query.uid)
    .then(doc => res.send(doc))
});

router.post('/saveUserProfile', (req, res) => {
    saveUserProfile(req.body.uid, req.body.courses, req.body.major, req.body.email, req.body.name);
});

router.get('/getAdminUser', (req, res) => {
    getAdminUser()
    .then(doc => res.send(doc))
});

module.exports = router;