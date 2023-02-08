const Mongoose = require("mongoose");

const orderSchema = new Mongoose.Schema(
  {
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "user",
      // required:true,
    },
    order_date: {
      type:Date,
      default:Date.now
    },
    total: {
      type: Number,
    },
    payment: {
      type: String,
    },
    address: {
      type: String,
      // required: true,
    },
    status: {
       type: String,
    },
    discount_amount:{
      type:Number
    },
    grand_total:{
      type:Number
    },
    deliverystatus:{
      ordered:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
   
    shipped:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
    out_for_delivery:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
    delivered:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
    returned:{
        state:{type:Boolean, default:false},
        date:{type:Date}
    },
    canceled:{
      state:{type:Boolean, default:false},
      date:{type:Date}
  },
    },
    products: [
      {
        item: {
          type: Object,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
   
      },
    ],
  },
  couponss = {
    name:{type:String},
    code:{type:String},
    discount:{type:Number},
  }
  );

  //     // discountCoupon: {
  //     //   type: Mongoose.Schema.Types.ObjectId,
  //     //   ref: 'Coupon',
  //     // },
  //   },
  //   {
  //     timestamps: true,
  //   }


module.exports = Mongoose.model("order", orderSchema);
