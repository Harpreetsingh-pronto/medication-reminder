'use strict';

var controller = require('./interaction.controller'),
    router = require('express').Router();

//Accepts the date in url and finds all the medications for that particular date and then call external service to find 
// any adverse interactions between any drugs
router.get('/:date', controller.show);

module.exports = router;
