const mongoose = require('mongoose');
require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, return all records
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {
        // Database returned no data
        return res
            .status(404)
            .json({ message: 'No trips found' });
    } else {
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ code: req.params.tripCode }) // Return single record
        .exec();

    // Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if (!q) {
        // Database returned no data
        return res
            .status(404)
            .json({ message: 'Trip not found' });
    } else {
        // Return resulting trip
        return res
            .status(200)
            .json(q);
    }
};

// POST: /trips - adds a new trip
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try {
        console.log(req.body);

        const newTrip = new Model({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const q = await newTrip.save();

        return res
            .status(201)
            .json(q);

    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};

// PUT: /trips/:tripCode - updates an existing trip
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    try {
        // Helpful during testing/debugging
        console.log(req.params);
        console.log(req.body);

        const q = await Model
            .findOneAndUpdate(
                { code: req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                }
            )
            .exec();

        if (!q) {
            // Database returned no matching trip
            return res
                .status(400)
                .json({ message: 'Unable to update trip' });
        } else {
            // Return resulting updated trip
            return res
                .status(201)
                .json(q);
        }

    } catch (err) {
        console.log(err);

        return res
            .status(400)
            .json(err);
    }
};

// DELETE: /trips/:tripCode - deletes an existing trip
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
// Added DELETE functionality 09/17/26
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndDelete({ code: req.params.tripCode })
            .exec();

        if (!q) {
            // Database returned no matching trip
            return res
                .status(404)
                .json({ message: 'Trip not found' });
        } else {
            // Return successful deletion message
            return res
                .status(200)
                .json({ message: 'Trip successfully deleted' });
        }

    } catch (err) {
        console.log(err);

        return res
            .status(500)
            .json({ message: 'Unable to delete trip' });
    }
};

// tripsDeleteTrip added on 09/17/26
module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};