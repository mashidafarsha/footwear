const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: true
    },
    Description: {
        type: String,
        require: true
    },
    Category: {
        type: String,
        require: true
    },
    Price:{
        type:Number,
        require:true
    },
    Date: {
        type: Date,
        required: true,
        
    },
    Stock:{
        type:Number,
        require:true
    },
    Image:{
        type:Array,
        require:true
    },
    Status:{
        type:Boolean,
        require:true,
        default:"true"
    }

})
module.exports=mongoose.model('products',productSchema)