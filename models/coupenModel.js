const mongoose = require('mongoose')
const coupenSchema = new mongoose.Schema({
    coupenname: {
        type: String,
        required: true,




    },
    coupenid: {
        type: String,
        required: true,
        unique: true,
        lowercase: true



    },
    minbill: {
        type: Number,
        require: true,

    },
    capamount: {
        type: Number,
        required: true,



    },
    status: {
        type: String,
        require: true,

    },
    expdate: {
        type: Date,
        require: true,

    },
    offer: {
        type: Number,
        require: true
    },
    used_user: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }




})
module.exports = mongoose.model('coupen', coupenSchema)