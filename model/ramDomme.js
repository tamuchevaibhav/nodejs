const mongoose = require('mongoose')

const randomuserSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true
    },
    name: {
        type: Object,
        required: true
    },
    location: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: {
        type: Object,
        required: true
    },
    registered: {
        type: Object,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cell: {
        type: String,
        required: true
    },
    id: {
        type: Object,
        required: true
    },
    nat: {
        type: String,
        required: true
    }
})

module.exports = randomuserSchema