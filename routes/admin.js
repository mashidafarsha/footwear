var express=require('express');
var router=express.Router();
var path=require('path');
var controller=require('../contoller/adminController')
let {verifyLoginAdmin}=require('../middilwear/adminAuth')
var multer  = require('multer')

router.use((req, res, next) => {
    req.app.set('layout',path.join(__dirname,'../views/layout/adminLayout.ejs'))
    next()
  })

  const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')

    if(isValid){
      uploadError = null
    }
    console.log("INSIDE MULTER");
    cb(uploadError,'./public/image/product-images')
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${filename}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage:storage})


  router.get('/',verifyLoginAdmin,controller.Home);
  router.get('/adminLogin',controller.admin)
  router.get('/adminLogout',controller.adminLogout)
  router.get('/viewProducts',verifyLoginAdmin,controller.viewProducts)
  router.get('/userManagement',verifyLoginAdmin,controller.viewUser)
  router.get('/categoryManagement',verifyLoginAdmin,controller.viewCategory)
  router.get('/blockUser/:id',controller.blockUser)
  router.get('/activeUser/:id',controller.activeUser)
  router.get('/addProduct',verifyLoginAdmin,controller.addProduct)
  router.get('/editProduct/:id',verifyLoginAdmin,controller.editProduct)
  router.get('/addCategory',verifyLoginAdmin,controller.addCategory)
  router.get('/editCategory/:id',verifyLoginAdmin,controller.editCategory)
  router.get('/deleteproduct/:id',controller.deleteProduct)
  router.get('/deleteBanner/:id',controller.deleteBanner)
  router.get('/deletecategory/:id',controller.deleteCategory)
  router.get('/viewCoupen',verifyLoginAdmin,controller.viewCoupen)
  router.get('/addCoupen',verifyLoginAdmin,controller.addCoupen)
  router.get('/editCoupen',verifyLoginAdmin,controller.editCoupen)
  router.get('/viewBanner',verifyLoginAdmin,controller.viewBanner)
  router.get('/addBanner',verifyLoginAdmin,controller.addBanner)
  router.get('/viewOrder',verifyLoginAdmin,controller.viewOrder)
  router.get('/editOrder/:id',verifyLoginAdmin,controller.editOrder)
  router.get('/salesAsk',verifyLoginAdmin,controller.salesAsk)
  router.get('/invoice/:id',verifyLoginAdmin,controller.inVoice)
 



  








  router.post('/adminlogin',controller.adminLogin)
  router.post('/addproduct',uploadOptions.array("image", 10),controller.addProductPost)
  router.post('/addcategory',controller.addCategoryPost)
  router.post('/editcategory/:id',controller.editCategoryPost)
  router.post('/editproduct/:id',uploadOptions.array("image", 10),controller.editProductPost)
  router.post('/addCoupen',controller.addCoupenPost)
  router.post('/addBanner',uploadOptions.array("image", 10),controller.addBannerPost)
  router.post('/delivery-status/:id',controller.deliveryStatus)
  router.post('/salesReport',controller.salesReport)

 

module.exports = router; 