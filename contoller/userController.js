var User = require("../models/userModel");
let Products = require("../models/productModel");
let Cart = require("../models/cart");
let Category = require("../models/categoryModel")
let Wishlist = require("../models/wishlist");
let Order = require("../models/orderModel");
const Coupen = require("../models/coupenModel");
let Banner = require("../models/bannerModel");
const otp = require("../contoller/otp");
const UserHelpers = require("../helpers/user-helpers.js");
const bcrypt = require("bcrypt");
const ObjectId = require("objectid");
const { generateOrder } = require("../helpers/user-helpers");
const createError = require("http-errors");

module.exports = {
  // USER HOME-------------------------------------------
  userHome: async (req, res, next) => {
    try {
    
     
      let user = req.session.user;
      
      

      let products = await Products.find({ Status: true });
      let banner = await Banner.find({ Status: true });
      console.log(products, "heyyy")
      res.render("user/userIndex", { user, products, banner,userz:true });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  // ------------------------------------------------------
  userLogin: (req, res, next) => {
    try {
      let user = req.session.user;
      if (req.session.loggedUser) {
        res.redirect("/");
      } else {
        res.render("user/userLogin", { user ,userz:false});
      }
    } catch (error) {
      next();
    }

  },
  userSignup: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render("user/userSignup", { user,userz:false });
    } catch (error) {
      next();
    }

  },
  // -----------------------------------------------------------------------------------------
  // USER SIGNUP------------------------------------------------------------------------------

  userPostSignup: async (req, res, next) => {
    try {
      let mobile = req.body.phone;
      let email = req.body.email;

      req.session.signup = req.body;
      console.log(req.session.signup);
      let userh = await User.findOne({ Email: email });
      if (userh) {
        res.redirect("/userLogin");
      } else {
        otp.sentOtp(mobile);
        res.redirect("/otpverification");
      }
    } catch (error) {
      next();
    }


  },
  postOtp: async (req, res, next) => {
    try {
      let otpData = req.body.otp;
      let { name, username, phone, email, password, conpassword } =
        req.session.signup;
      await otp.verifyOtp(phone, otpData).then(async (verification_check) => {
        console.log(verification_check.status);
        if (verification_check.status === "approved") {
          let newpassword = await bcrypt.hash(password, 10);
          let newconpassword = await bcrypt.hash(conpassword, 10);
          userDetails = User({
            fullName: name,
            userName: username,
            phone: phone,
            Email: email,
            Cpassword: newconpassword,
            passWord: newpassword,
          });
          console.log(userDetails);
          let userData = await userDetails.save();
          if (userData) {
            console.log(userData);
            req.session.loggedUser = true;
            res.redirect("/userLogin");
          } else {
            res.redirect("/userSignup");
          }
        } else if (verification_check.status === "pending") {
          console.log("otp not match");
          res.redirect("/userSignup");
        }
      });
    } catch (error) {
      next();
    }


  },
  otpLogin: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render("user/otpverification", { user,userz:true });
    } catch (error) {
      next();
    }

  },

  userPostLogin: async (req, res, next) => {
    try {
      let userData = req.body;
      let userDetails = await User.findOne({
        Email: userData.email,
        status: "Active",
      });

      if (!userDetails) {
        res.redirect("/userLogin");
      }

      let isMatch = await bcrypt.compare(userData.password, userDetails.passWord);
      if (!isMatch) {
        console.log("loggin error");
        res.redirect("/userLogin");
      } else {
        req.session.loggedUser = true;
        req.session.user = userDetails;
        console.log("loggin success");
        res.redirect("/");
      }
    } catch (error) {
      next();
    }

  },
  userLogout: (req, res, next) => {
    try {
      req.session.userLoggedOut = true;
      req.session.destroy();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },

  productDetails: async (req, res, next) => {
    try {
      let proId = req.params.id;
      let product = await Products.findById({ _id: proId });
      console.log(product);
      let user = req.session.user;
      res.render("user/product-details", { user, product ,userz:true});
    } catch (err) {
      next(err);
    }

  },
  Cart: async (req, res, next) => {
    try {
      let user = req.session.user;
      let userId = req.session.user._id;

      let cartDetails = await Cart.findOne({ user: userId }).populate(
        "products.item"
      );
      console.log(cartDetails);

      res.render("user/Cart", { user, userId, cartDetails ,userz:true});

    } catch (err) {
      next(err);
    }

  },


  addToCart: async (req, res, next) => {
    try {
      console.log("hi");
      let userId = req.session.user._id;
      let proId = req.query.id;

      let product = await Products.findOne({ _id: proId });
      console.log(product, "product");
      let proObj = {
        item: proId,
        quantity: 1,
        price: product.Price,
      };
      console.log(proId, "proid");
      console.log(proObj, "proobj");
      let userCartData = await Cart.findOne({ user: userId });
      console.log(userCartData);
      if (userCartData) {
        let proExist = userCartData.products.findIndex((p) => p.item == proId);

        console.log(proExist);
        if (proExist != -1) {
          const quantity = userCartData.products[proExist].quantity;
          await Cart.updateOne(
            {
              user: userId,
              "products.item": proId,
            },
            {
              $inc: {
                "products.$.quantity": 1,
                "products.$.price": product.Price,
                totalprice: product.Price,
              },
            }
          );
        } else {
          await Cart.updateOne(
            { user: userId },
            { $push: { products: proObj }, $inc: { totalprice: product.Price } }
          );
        }
      } else {
        let userCart = {
          user: userId,
          products: [proObj],
          totalprice: product.Price,
        };
        let newCart = await Cart.create(userCart);
        console.log(newCart, "masasd");
      }
      // let user = req.session.user;
      res.json({ status: true, access: true });
    } catch (err) {
      next(err);
    }

  },

  changeQuantity: async (req, res, next) => {
    try {
      let totalAmount;
      let productprice;
      let details = req.body;
      let product = await Products.findOne({ _id: details.product });
      console.log(product, "crtpro");
      details.count = parseInt(details.count);
      details.quantity = parseInt(details.quantity);

      if (details.count == -1 && details.quantity == 1) {
        let data = await Cart.findByIdAndUpdate(
          { _id: details.cart },
          {
            $pull: { products: { item: details.product } },
            $inc: { totalprice: -product.Price },
          },
          { new: true }
        );

        totalAmount = data.totalprice;
        productprice = product.Price;
        console.log(data);
        if (data) {
          res.json({ removeProduct: true, totalAmount, productprice });
        }
      } else {
        const data = await Cart.updateOne(
          {
            _id: details.cart,
            "products.item": details.product,
          },
          {
            $inc: {
              "products.$.quantity": details.count,
              "products.$.price": product.Price * details.count,
              totalprice: product.Price * details.count,
            },
          }
        );

        let cartdatas = await Cart.findOne({ user: details.user });

        let proExist = cartdatas.products.findIndex(
          (p) => p.item == details.product
        );
        let q = cartdatas.products[proExist].quantity;

        totalAmount = cartdatas.totalprice;
        console.log(totalAmount, "total");
        productprice = product.Price;
        res.json({ status: true, totalAmount, productprice, q });
      }
    } catch (err) {
      next(err);
    }

  },
  deleteCart: async (req, res, next) => {
    try {
      let details = req.body
      let product = await Products.findOne({ _id: details.proId });
      let data = await Cart.findByIdAndUpdate(
        { _id: details.cart },
        {
          $pull: { products: { item: details.proId } },
        }
      );
      console.log(data.products[0], "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      const index = data.products.findIndex((obj) => obj.item == details.proId);
      const proPrice = data.products[index].price;
      console.log(proPrice, "heloooooooooooooooooooooooooo");
      let datas = await Cart.findByIdAndUpdate(
        { _id: details.cart },
        {
          $inc: { totalprice: -proPrice },
        },
        { new: true }
      );


      res.json({ removeProduct: true });
    } catch (err) {
      next(err);
    }

  },

  wishList: async (req, res, next) => {
    try {
      let user = req.session.user;
      let userId = req.session.user._id;
      let wishlists = await Wishlist.findOne({ user: userId }).populate(
        "product"
      );

      console.log(wishlists, "fghj");
      res.render("user/wishlist", { user, wishlists,userz:true });
    } catch (err) {
      next(err);
    }

  },
  addToWishlist: async (req, res, next) => {
    try {
      let userId = req.session.user._id;
      let proId = req.params.id;
      console.log(userId, proId);
      let wishlist = await Wishlist.findOne({ user: userId });
      console.log(wishlist, "dfgh");
      if (wishlist) {
        await Wishlist.findOneAndUpdate(
          { user: userId },
          { $addToSet: { product: proId } }
        );
      } else {
        userWishlist = {
          user: userId,
          product: [proId],
        };
        let newwishlist = await Wishlist.create(userWishlist);
        console.log(newwishlist, "kkkkkkkkkkkkkkk");
      }
      res.redirect("/");
    } catch (err) {
      next(err);
    }

  },
  deleteWishlist: async (req, res, next) => {
    try {
      let details = req.body

      let data = await Wishlist.findByIdAndUpdate(
        { _id: details.wishlist },
        {
          $pull: { product: details.proId },
        }
      );
      res.json({ removeProduct: true });
    } catch (err) {
      next(err);
    }

  },

  userCheckout: async (req, res, next) => {
    try {
      let user = req.session.user;
      let userId = req.session.user._id;
      console.log(userId);
      let cartData = await Cart.findOne({ user: userId }).populate(
        "products.item"
      );
      let userData = await User.findOne({ _id: userId });

      console.log(cartData, "userdata");
      res.render("user/checkout", { user, cartData, userData ,userz:true});
    } catch (err) {
      next(err);
    }

  },
  placeOrder: async (req, res, next) => {
    try {
      let userId = req.body.userId;

      let cart = await Cart.findOne({ user: userId }).populate("products.item");
      let cartD = cart.products;



      if (req.session.coupon != null) {
        couponData = req.session.coupon
        let userCoupon = await Coupen.findOne({ coupenid: couponData })
        couponss = {
          name: userCoupon.name,
          code: userCoupon.code,
          discount: userCoupon.discount,
        }
        if (userCoupon) {
          let discount = Math.round(cart.totalprice * (userCoupon.offer / 100))

          if (discount > userCoupon.capamount) {
            maxDiscount = Math.round(userCoupon.capamount)
            total = cart.totalprice - maxDiscount
          } else {
            total = cart.totalprice - discount
            maxDiscount = discount
          }
        }
      } else {

        couponss = {
          name: 'nil',
          code: 'nil',
          discount: 0,
        }
        total = cart.totalprice
        maxDiscount = 0

      }


      let status = req.body["Shipping-Method"] === "COD" ? "placed" : "pending";
      orderData = Order({
        userId: req.body.userId,
        address: req.body.address,
        status: status,
        payment: req.body["Shipping-Method"],
        discount_amount: maxDiscount,

        total: cart.totalprice,
        grand_total: total,
        products: cart.products,
        "deliverystatus.ordered.state": true,
      });
      let order = await orderData.save();
      if (req.body["Shipping-Method"] === "COD") {
        res.json({ codStatus: true });
      } else {
        let Data = await UserHelpers.generateOrder(order);
        console.log(Data);
        res.json({ Data });
      }

      let deletecart = await Cart.deleteOne({ user: userId });
    } catch (err) {
      next(err);
    }

  },
  verifyPayment: (req, res, next) => {
    try {
      UserHelpers.verifyRzrpy(req.body)
        .then(async () => {
          console.log("success");
          const id = req.body["Data[receipt]"];
          console.log(id, "idddddd");
          let = await Order.updateOne(
            { _id: id },
            {
              $set: {
                status: "placed",
              },
            }
          );
          res.json({ status: true });
        })
        .catch((err) => {
          console.log(err + "error");
          res.json({ status: false, errMsg: "" });
        });
    } catch (err) {
      next(err);
    }


  },

  myAccount: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render("user/my-account", { user,userz:true });
    } catch (err) {
      next(err);
    }

  },
  yourAccount: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render("user/your-account", { user,userz:true });
    } catch (err) {
      next(err);
    }

  },
  yourAccountPost: async (req, res, next) => {
    try {
      let Address = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        state: req.body.state,
        district: req.body.district,
        pin: req.body.pin,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
      };
      //  console.log(AddressData);

      let userId = req.session.user._id;
      let user = await User.findOne({ _id: userId });
      console.log(user.AddressData);
      await User.updateOne({ _id: userId }, { $push: { AddressData: Address } });
      res.redirect("/your-account");
    } catch (err) {
      next(err);
    }

  },
  applyCoupon: async (req, res, next) => {
    try {
      let userId = req.session.user._id;
      let couponCode = req.body.code;
      let cart = await Cart.findOne({ user: userId });
      let coupon = await Coupen.findOne({
        coupenid: couponCode,
        used_user: { $nin: [userId] },
        status: "active",
      });
      if (coupon) {
        let date = new Date(coupon.expdate)
        const currentDate = new Date();
        if (date.getTime() < currentDate.getTime()) {
          res.json({ expired: true });
        } else {
          if (cart.totalprice > coupon.minbill) {
            let discount = Math.round(cart.totalprice * (coupon.offer / 100));
            console.log(discount);
            if (discount > coupon.capamount) {
              let maxdiscount = Math.round(coupon.capamount);

              let total = cart.totalprice - maxdiscount;
              console.log(total, "total");
              req.session.coupon = couponCode
              res.json({ success: true, newTotal: total, discount: maxDiscount });
            } else {
              let total = cart.totalprice - discount;
              console.log(total, "max");
              console.log(discount, "dis");
              req.session.coupon = couponCode
              res.json({ success: true, newTotal: total, discount: discount });
            }
            await coupon.updateOne(
              {
                $addToSet: {
                  used_user: userId,
                },
              }
            );
          } else {
            req.session.coupon = null
            res.json({ notapplicable: true });
            console.log("notapp");
          }
        }



      } else {
        req.session.coupon = null
        res.json({ success: false });
        console.log("invalid");
      }
    } catch (err) {
      next(err);
    }

  },

  orderSuccess: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render("user/order-success", { user,userz:true });
    } catch (err) {
      next(err);
    }

  },
  viewOrder: async (req, res, next) => {
    try {
      let user = req.session.user;
      let userId = req.session.user._id;

      let order = await Order.find({ userId }).sort({ order_date: -1 }).populate("products.item");
      console.log(order);

      res.render("user/viewOrder", { user, order,userz:true });
    } catch (err) {
      next(err);
    }
  },
  orderDetails: async (req, res, next) => {
    try {
      let orderId = req.params.id;
      let user = req.session.user;
      let userId = req.session.user._id;
      let order = await Order.findOne({ userId, _id: orderId })

      console.log(order, "here");
      res.render("user/order-details", { user, order,userz:true });
    } catch (err) {
      next(err);
    }

  },
  cancelOrder: async (req, res, next) => {
    try {
      let orderId = req.params.id;

      let Data = await Order.findByIdAndUpdate(
        { _id: orderId },
        {
          $set: {
            "deliverystatus.canceled.state": true,
            status: "retur",
          },
        }
      );
      console.log(Data, "llllllllllllllllllllllll");
      res.redirect("/order-details/" + orderId);
    } catch (err) {
      next(err);
    }

  },
  aboutUs: (req, res, next) => {
    try {
      let user = req.session.user;
      res.render('user/aboutUs', { user,userz:true })
    } catch (err) {
      next(err);
    }
  },
  shopPage: async (req, res, next) => {
    try {
      let user = req.session.user;
      let products = await Products.find({ Status: true })
      let category = await Category.find({ Status: true })
      res.render('user/shopPage', { user, category, products,userz:true })
    } catch (err) {
      next(err);
    }
  },
  categoryProduct: async (req, res, next) => {
    try {
      let catId = req.query.id;
      let catName = await Category.findById({ _id: catId })
      let catgoryname = catName.categoryName
      let catPro = await Products.find({ Category: catgoryname })
      console.log(catPro, "kkkkkkkkkkkkkkk");
      res.json({ catPro })
    } catch (err) {
      next(err);
    }
  }

};
