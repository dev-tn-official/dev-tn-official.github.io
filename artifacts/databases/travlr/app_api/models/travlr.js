const mongoose = require('mongoose');

// Define the trip schema
// Enhanced 10/02/26 to improve data validation and database integrity
const tripSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    length: {
        type: String,
        required: true,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },
    resort: {
        type: String,
        required: true,
        trim: true
    },
    perPerson: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^\d+(\.\d{2})?$/.test(value);
            },
            message: 'Price per person must be a valid non-negative monetary value.'
        }
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;