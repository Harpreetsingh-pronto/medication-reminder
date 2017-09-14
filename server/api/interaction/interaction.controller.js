'use strict';

var q = require('q'),
    moment = require('moment'),
    Medication = require('../medication/medication.model'),
    request = require('request');

exports.show = (req, res) => {
    
    const STATIC_END_POINT = 'https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=';
    let queryString = '';
    let formats = [
       moment.ISO_8601,
        "MM-DD-YYYY",
        "DD-MM-YYYY",
        "YYYY-MM-DD"
    ]

    if (!moment(req.params.date, formats, true).isValid()) {
        return res.status(400).send('Invalid date format');
    }

    let query = {
            $and: [
                { time: { $gte: moment(req.params.date).startOf('day') } },
                { time: { $lt: moment(req.params.date).add(1, 'days') } }
            ]
        };
    // method hits the external API and check for adverse interactions 
    const externalAPICall = (url, callback) => {

        request({ uri: url }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    callback(body);        
                } else {
                    throw 'error calling api';
                }
            });
    }
    //method consolidates all rxcui identifiers of the medications in a string for a specific date
    const checkAdverseInteractions = medications => {

        if(medications && medications.length > 0) {
            medications.forEach( (value, index) => {
                queryString += value.rxcui 
                if( index != medications.length - 1) 
                    queryString += "+";
            });
            externalAPICall( STATIC_END_POINT + queryString, (body) => res.send(body));
        } else {
            res.send(404);
        }
    }

    const errorFunction = (err) => {
        console.error('Error occured getting medication', err);
        res.send(500);
    }

    q(Medication.find(query).exec()).then(checkAdverseInteractions).catch(errorFunction);
    
};
