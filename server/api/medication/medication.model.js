'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MedicationSchema = new Schema({
    name: String,
    dosage: String,
    time: Date,
    completed: Boolean,
    d: {
        c: Date, //date created
        m: Date,  //date updated
        f: Date //date completed
    }
});

module.exports = mongoose.model('Medication', MedicationSchema);
