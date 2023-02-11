const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    fullName : {
        type: String,
        required: true
    },
    userName : {
        type: String,
        required: true
    },
    password : {
        type: String,
        require:true
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
   
})
module.exports=mongoose.model('admins',adminSchema);
