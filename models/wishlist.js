const mongoose=require('mongoose')
const wishlistSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      product: [
        
          {
            
              type:mongoose.Schema.Types.ObjectId ,
              ref:"products"
                          
          }
          
           
          
        
        ]
})
module.exports = mongoose.model("wishlist", wishlistSchema);