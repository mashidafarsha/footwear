const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    userName:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,

    },
    phoneVerification:{
        type:String,
        enum:["true", "false"],
        default:"false"
    },
    Email:{
        type:String,
        require:true
    },
    passWord:{
        type:String,
        require:true
    },
    CpassWord:{
        type:String,
        require:true
    },
    Date: {
		type: Date,
		default: Date.now,
		required: true
	},
    status: {
        type: String,
        enum:["Active", "Blocked"],
        default:"Active"
    },

    AddressData:[{
        firstname:{
            type:String,
            require:true
        },
        lastname:{
            type:String,
            require:true 
        },
       
        address:{
            type:String,
            require:true
        },
       
        state:{
            type:String,
            require:true
        },
        district:{
            type:String,
            require:true
        },
        pin:{
            type:Number,
            require:true
        },
        email:{
            type:String,
            require:true 
        },
        phonenumber:{
            type:Number,
            require:true 
        }
}]
                                                                                                        
})
module.exports=mongoose.model('user',userSchema)
