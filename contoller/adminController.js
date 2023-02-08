const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Products = require("../models/productModel");
const Category = require("../models/categoryModel");
const Coupen = require("../models/coupenModel");
let Banner = require("../models/bannerModel");
let Order=require("../models/orderModel")
const createError=require('http-errors')

var objectid = require("objectid");
const { findByIdAndUpdate } = require("../models/userModel");

module.exports = {
  // HOME------------------------------------------------

  Home:async (req,res,next) => {
    try {
      let admin = req.session.admin;
      let ordered=(await Order.find({'deliverystatus.ordered.state':true})).length
      let delivered=(await Order.find({'deliverystatus.delivered.state':true})).length
       let placed=(await Order.find({status:"placed"})).length
     
      // let ordered=await Order.find({'deliverystatus.ordered.state':true})
      // let ordered=await Order.find({'deliverystatus.ordered.state':true})
      // let ordered=await Order.find({'deliverystatus.ordered.state':true})
      console.log(delivered);
      res.render("admin/adminIndex", { admin,ordered,delivered,placed });
    } catch (err) {
      next(err);
    }
  },

  // -----------------------------------------------------

  // LOGIN RENDER------------------------------------------
  admin: (req, res) => {
    try {
      if (req.session.loggedIn) {
        res.redirect("/admin");
      } else {
        let admin = req.session.admin;
        res.render("admin/adminLogin", { admin });
      }
    } catch (err) {
      next(err);
    }
  },
  // -------------------------------------------------------

  // LOGIN POST---------------------------------------------

  adminLogin: async (req, res) => {
    try {
      const { Email, password } = req.body;
      console.log(Email);
      const admin = await Admin.findOne().where({ email: Email });
      //console.log(admin);
      if (!admin) {
        res.redirect("/admin/adminLogin");
      } else {
        const isMatch = await Admin.findOne({ password });
        // console.log(isMatch);
        req.session.loggedIn = true;
        req.session.admin = admin;

        // console.log(req.session.admin);
        res.redirect("/admin");
      }
    } catch (err) {
      next(err);
    }
  },
  // ------------------------------------------------------
  // ADMIN LOGOUT--------------------------------------------

  adminLogout: (req, res) => {
    try {
      req.session.loggedOut = true;
      req.session.destroy();
      res.redirect("/admin/adminLogin");
    } catch (err) {
      next(err);
    }
  },
  // ---------------------------------------------------------
  // VIEW PRODUCT------------------------------------------
  viewProducts: async (req, res) => {
    try {
      let admin = req.session.admin;
      let productData = await Products.find({ Status: "true" });

      res.render("admin/viewProducts", { productData, admin });
    } catch (err) {
      next(err);
    }
  },
  // ------------------------------------------------------
  // ADD PRODUCTS RENDER----------------------------------
  addProduct: async (req, res) => {
    try {
      let admin = req.session.admin;
      let categoryData = await Category.find();
      res.render("admin/addProduct", { categoryData, admin });
    } catch (err) {
      next(err);
    }
  },
  // -------------------------------------------------------
  // ADD PRODUCT POST---------------------------------------
  addProductPost: (req, res) => {
    console.log(req.body);

    try {
      let image = req.files.map((file) => file.filename);

      console.log(image);
      productDetails = Products({
        productName: req.body.productname,
        Description: req.body.description,
        Category: req.body.category,
        Price: req.body.price,
        Date: req.body.date,
        Stock: req.body.stock,
        Image: image,
      });

      productDetails.save().then(() => {
        res.redirect("/admin/viewProducts");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // -----------------------------------------------------------
  // EDIT PRODUCT RENDER----------------------------------------
  editProduct: async (req, res) => {
    try {
      let admin = req.session.admin;
      let Id = req.params.id;
      let category = await Category.find();
      let product = await Products.findOne({ _id: Id });
      console.log(product, "asd");
      console.log(category);
      res.render("admin/editProduct", { product, category, admin });
    } catch (err) {
      next(err);
    }
  },
  // -------------------------------------------------------------
  // EDIT PRODUCT POST---------------------------------------------
  editProductPost: async (req, res,next) => {
    try {
      let Id = req.params.id;
      console.log(req.files,"files");
      let image = req.files.map((file) => file.filename);
      //console.log(Id);
      await Products.findByIdAndUpdate(
        { _id: objectid(Id) },
        {
          $set: {
            productName: req.body.productname,
            Description: req.body.description,
            Category: req.body.category,
            Price: req.body.price,
            Date: req.body.date,
            Stock: req.body.stock,
            Image:image
          },
        }
      ).then(() => {
        res.redirect("/admin/viewProducts");
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  // ---------------------------------------------------------------
  // DELETE PRODUCTS-----------------------------------------------
  deleteProduct: async (req, res) => {
    try {
      let Id = req.params.id;

      let deleteData = await Products.findByIdAndUpdate(
        { _id: Id },
        { Status: "false" }
      );
      // await Products.findByIdAndDelete({ _id: objectid(Id) }).then(() => {
      res.redirect("/admin/viewProducts");
      // });
    } catch (err) {
      next(err);
    }
  },
  // ---------------------------------------------------------------
  // USER MANAGEMENT-------------------------------------------------

  viewUser: async (req, res) => {
    try {
      let admin = req.session.admin;
      let userData = await User.find();
      res.render("admin/userManagement", { userData, admin });
    } catch (err) {
      next(err);
    }
  },
  // ---------------------------------------------------------------
  // BLOCK USER-----------------------------------------------------

  blockUser: async (req, res) => {
    try {
      let id = req.params.id;
      await User.findByIdAndUpdate(
        { _id: id },
        { $set: { status: "Blocked" } }
      ).then(() => {
        res.redirect("/admin/userManagement");
      });
    } catch (err) {
      next(err);
    }
  },
  // -------------------------------------------------------------------
  // ACTIVE USER-------------------------------------------------------
  activeUser: async (req, res) => {
    try {
      let id = req.params.id;
      await User.findByIdAndUpdate(
        { _id: id },
        { $set: { status: "Active" } }
      ).then(() => {
        res.redirect("/admin/userManagement");
      });
    } catch (err) {
      next(err);
    }
  },
  // -----------------------------------------------------------------------

  //CATEGORY MANAGEMENT------------------------------------------------------

  viewCategory: async (req, res,next) => {
    try {
      let admin = req.session.admin;
      let categoryData = await Category.find({ Status: "true" });

      res.render("admin/categoryManagement", { categoryData, admin });
    } catch (err) {
      next(err);
    }
  },
  // ------------------------------------------------------------------------
  // ADD CATEGORY RENDER---------------------------------------------------
  addCategory: (req, res,next) => {
    try {
      let admin = req.session.admin;
      res.render("admin/addCategory", { admin });
    } catch (err) {
      next(err);
    }
  },
  // --------------------------------------------------------------------------
  // ADD CATEGORY POST-------------------------------------------------------
  addCategoryPost: async (req, res, next) => {
    try {
      const categoryData = Category({
        categoryName: req.body.category,
        Description: req.body.description,
      });
      await categoryData.save().then(() => {
        res.redirect("/admin/categoryManagement");
      });
    } catch (err) {
      console.log(err, "hellooooooo");
       next(err)
    }
  },
  // ---------------------------------------------------------------------------
  // EDIT CATEGORY RENDER-----------------------------------------------------
  editCategory: async (req, res) => {
    try {
      let Id = req.params.id;

      let categoryData = await Category.findOne({ _id: objectid(Id) });

      res.render("admin/editCategory", { categoryData });
    } catch (err) {
      next(err);
    }
  },
  //
  // EDIT CATEGORY POST-----------------------------------------------------------
  editCategoryPost: async (req, res) => {
    try {
      let Id = req.params.id;
      await Category.findByIdAndUpdate(
        { _id: objectid(Id) },
        {
          $set: {
            categoryName: req.body.category,
            Description: req.body.description,
          },
        }
      ).then(() => {
        res.redirect("/admin/categoryManagement");
      });
    } catch (err) {
      next(err);
    }
  },
  // --------------------------------------------------------------------------
  // DELETE CATEGORY-----------------------------------------------------------
  deleteCategory: async (req, res) => {
    try {
      let Id = req.params.id;
      let category = await Category.findByIdAndUpdate(
        { _id: Id },
        { Status: "false" }
      );
      res.redirect("/admin/categoryManagement");
    } catch (err) {
      next(err);
    }
  },
  // ----------------------------------------------------------------------------------
  viewCoupen: async (req, res) => {
    let admin = req.session.admin;
    let coupendata = await Coupen.find();
    console.log(coupendata);
    res.render("admin/viewCoupen", { admin, coupendata });
  },
  addCoupen: (req, res) => {
    let admin = req.session.admin;

    res.render("admin/addCoupen", { admin });
  },
  addCoupenPost: async (req, res) => {
    try {
      coupenData = Coupen({
        coupenname: req.body.coupenname,
        coupenid: req.body.coupenid,
        minbill: req.body.minbill,
        capamount: req.body.capamount,
        status: req.body.status,
        expdate: req.body.expdate,
        offer: req.body.offer,
      });
      await coupenData.save().then(() => {
        res.redirect("/admin/addCoupen");
      });
    } catch (err) {
      next(err);
    }
  },
  editCoupen: (req, res) => {
    let admin = req.session.admin;
    res.render("admin/editCoupen", { admin });
  },
  viewBanner: async (req, res) => {
    let admin = req.session.admin;
    let banner = await Banner.find();
    res.render("admin/viewBanner", { admin, banner });
  },
  addBanner: async (req, res) => {
    let admin = req.session.admin;

    res.render("admin/addBanner", { admin });
  },
  addBannerPost: async (req, res) => {
    const { bannerName, discription } = req.body;

    let bannerimage = req.files.map((file) => file.filename);

    console.log(bannerimage);

    const newBanner = Banner({
      bannerName,
      discription,
      image: bannerimage,
    });
    console.log(newBanner);

    await newBanner.save().then(() => {
      res.redirect("/admin/viewBanner");
    });
  },

  viewOrder:async(req,res)=>{
    let admin = req.session.admin;
    let order=await Order.find()
    console.log(order);
    res.render('admin/viewOrder',{admin,order})
  },
  editOrder:async(req,res)=>{
    let admin = req.session.admin;
    let orderId=req.params.id
    let order=await Order.findOne({_id:orderId})
    console.log(order,"oooooooooooooooooooooooo");

    res.render('admin/editOrder',{admin,order})
  },
  deliveryStatus: async (req, res, next) => {
    try {
      orderId = req.params.id

      if (req.body.deliveryStatus == 'shipped') {
        Order.updateOne({ _id: orderId }, { $set: { 'deliverystatus.shipped.state': true, 'deliverystatus.shipped.date': Date.now() } }).then((data) => {
          res.redirect('/admin/editOrder/' + orderId)
        })
      } else if (req.body.deliveryStatus == 'outForDelivery') {
        Order.updateOne({ _id: orderId }, { $set: { 'deliverystatus.out_for_delivery.state': true, 'delivery_status.out_for_delivery.date': Date.now() } }).then((data) => {
          res.redirect('/admin/editOrder/' + orderId)
        })
      } else if (req.body.deliveryStatus == 'delivered') {
        Order.updateOne({ _id: orderId }, { $set: { 'deliverystatus.delivered.state': true, 'delivery_status.delivered.date': Date.now() } }).then((data) => {
          res.redirect('/admin/editOrder/' + orderId)
        })
      }
    } catch (error) {
      console.log(error);
      next();
    }

  },
  inVoice:async(req,res)=>{
    let admin = req.session.admin;
    let orderId = req.params.id
   
    let orderInfo = await Order.findOne({ _id:orderId}).populate(['products.item','userId'])
    console.log(orderInfo,"kkkkkkkkkkkkkkk")
    res.render('admin/invoice',{admin})
  },
  salesAsk:(req,res)=>{
    let admin = req.session.admin;
    res.render('admin/salesAsk',{admin})
  },
  salesReport:async(req,res,next)=>{
   
    console.log('report');
    try {
      console.log(req.body)
      let admin = req.session.admin;
      let salesData = await Order.aggregate([
        {
          $match: {
            status: "placed",
            $and: [
              { order_date: { $gt: new Date(req.body.fromDate) } },
              { order_date: { $lt: new Date(req.body.toDate) } },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $sort: { ordered_date: -1 } },
      ]);
      let salesDatas=salesData
      console.log(salesDatas, "innnn");
      res.render('admin/salesReport', {admin, title: 'Sales Report', page: 'Sales Report', salesData })
    } catch (error) {
      console.log(error);
      next(createError(404));
    }
  
  }
};
