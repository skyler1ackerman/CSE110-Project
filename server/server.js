'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
    credentials: true
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/', require('../routes/profileController'));
app.use('/', require('../routes/reportController'));
app.use('/', require('../routes/requestController'));
app.use('/', require('../routes/searchController'));
app.use('/', require('../routes/dashboardController'));
app.use('/', require('../routes/feedbackController'));
/*
app.get('/', (req, res) => {
    res.send('Hello World');
  });
*/
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));