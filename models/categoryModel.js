const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique: true,
        lowercase: true

    },
    Description:{
        type:String,
        require:true,
       
    },
    // Image:{
    //     type:String,
   
    // },
    // Status:{
    //     type:Boolean,
    //     require:true,
    //     default:"true"
    // }

})
module.exports=mongoose.model('category',categorySchema)