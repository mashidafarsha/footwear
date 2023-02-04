const Razorpay = require('razorpay');
const crypto = require('crypto');

var instance = new Razorpay({
  key_id: 'rzp_test_LSJeDQEzbT9qcg',
  key_secret: '88BDszrPYjTMmOinTnjqndco',
});


let generateOrder = (order) => {
  return new Promise((resolve, reject) => {
    console.log(order, 'huiiiiiiiiiiiiiiiiiiiiiiiiiiii');
    const orderId = order._id
    const total = order.total
    console.log(orderId, total, "abc");

    instance.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: "" + orderId,
      notes: {
        key1: "value3",
        key2: "value2"
      }
    }).then((response) => {
      console.log(response, "hhhhhhhhhhhhhh");
      resolve(response)
    }).catch((e) => {
      console.log(e);
    })
  })






}

let verifyRzrpy = (details) => {
  console.log(details,"lllllllllllllllllllllllll");
  return new Promise((resolve, reject) => {
    let hmac = crypto.createHmac('sha256', '88BDszrPYjTMmOinTnjqndco');
    hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
    hmac=hmac.digest('hex');
   
    if (hmac==details['payment[razorpay_signature]']) {
        resolve()
    }else{
      reject()
    }
  })
}





module.exports = { generateOrder, verifyRzrpy }

