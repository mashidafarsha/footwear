let express=require("express");
const createError=require('http-errors')
let path=require("path");
let app=express();
const expressLayouts = require('express-ejs-layouts')
let userRouter=require('./routes/user');
let adminRouter=require('./routes/admin');
const mongooseDB = require('./config/connection');
const clearcache=require('./middilwear/cache')
mongooseDB.init()
let session = require('express-session');


app.use(clearcache);



// view engine setup
app.use(expressLayouts)
app.set('layout',path.join(__dirname,'views/layout/baseLayout.ejs'))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

// static use
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000000}
  }))
 

app.use('/',userRouter);
app.use('/admin',adminRouter);

// 

// Error route

// app.use(function (req, res, next) {
// console.log('hiii errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
//   next(createError(404));
// });


// app.use(function (err, req, res, next) {
//   console.log("admin error route handler")
  
//   res.status(err.status || 500);
//   if(res.status==404){
//     console.log("gggggggggggggggggggggggg")
//     res.render('error/error');
//   }else{
//     console.log("gggggggggggggggggggddddddddddddddddddggggg")
//     res.render('error/error');
//   }
 
// });
app.use( (err, req, res, next) => {
  let errStatus = err.status || 500;
  // render the error page
  console.log(err);
  res.status(errStatus);
  if(errStatus==404) {
    console.error(err);
    res.render('error/error')
  }else{
        res.send('<div style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; text-align:center;"><h2 style="color:red;">500 |  Internal error detected!</h2> We will be back soon..</div>')
        // res.render('error');
        
    }
});


// port setting;
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));