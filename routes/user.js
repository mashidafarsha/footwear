const { countReset } = require('console');
var express=require('express');
var router=express.Router();
var path=require('path');
var controller=require('../contoller/userController')
const {verifyLogin}=require('../middilwear/auth')
const {verifyAjaxUser}=require('../middilwear/ajaxAuth')


router.use((req, res, next) => {
    req.app.set('layout',path.join(__dirname,'../views/layout/userLayout.ejs'))
    next()
  })

router.get('/',controller.userHome)
router.get('/userLogin',controller.userLogin)
router.get('/userSignup',controller.userSignup)
router.get('/otpverification',controller.otpLogin)
router.get('/userLogout',controller.userLogout)
router.get('/product-details/:id',controller.productDetails)
router.get('/cart',verifyLogin, controller.Cart)
router.get('/add-to-cart',verifyAjaxUser,controller.addToCart)
router.get('/wishlist',verifyLogin,controller.wishList)
router.get('/add-wishlist/:id',verifyLogin,controller.addToWishlist)
router.get('/checkout',verifyLogin,controller.userCheckout)
router.get('/my-account',controller.myAccount)
router.get('/your-account',verifyLogin,controller.yourAccount)
router.get('/deleteCart/:cartId/:proId/:userId',controller.deleteCart)
router.get('/order-success',controller.orderSuccess)
router.get('/viewOrder',verifyLogin,controller.viewOrder)
router.get('/order-details/:id',verifyLogin,controller.orderDetails)
router.get('/cart-empty',controller.cartEmpty)
router.get('/cancel-order/:id',controller.cancelOrder)


router.post('/usersignup',controller.userPostSignup)
router.post('/userlogin',controller.userPostLogin)
router.post('/postotp',controller.postOtp)
router.post('/change-product-quantity',controller.changeQuantity)
router.post('/youraccount',controller.yourAccountPost)
router.post('/checkout',controller.placeOrder)
router.post('/apply-coupen',verifyAjaxUser,controller.applyCoupon)
router.post('/verify-payment',controller.verifyPayment)


   

module.exports = router; 