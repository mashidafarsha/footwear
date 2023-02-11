const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required: true,
    },
    discription: {
        type: String,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    Status:{
        type:Boolean,
        require:true,
        default:"true"
    }


})

module.exports =mongoose.model('Banner', bannerSchema);