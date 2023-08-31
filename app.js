let express = require("express");
const createError = require("http-errors");
let path = require("path");
let app = express();
const expressLayouts = require("express-ejs-layouts");
let userRouter = require("./routes/user");
let adminRouter = require("./routes/admin");
// const mongooseDB = require("./config/connection");
const clearcache = require("./middilwear/cache");
const mongoosedb=require("./config/connection")

let session = require("express-session");

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 },
  })
);
mongoosedb.init()
app.use(clearcache);

// view engine setup
app.use(expressLayouts);
app.set("layout", path.join(__dirname, "views/layout/baseLayout.ejs"));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// static use
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/", userRouter);
app.use("/admin", adminRouter);

//

// Error route

app.use(function (req, res, next) {
  const err = createError("hiiiii");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.status, "asdfghjk");
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  let errStatus = err.status || 500;
  // render the error page
  console.log(errStatus, "status");
  res.status(errStatus);
  if (errStatus == 404) {
    console.error(err);
    res.render("error/error", { userz: null, adminz: null });
  } else {
    res.send(
      '<div style="font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif; text-align:center;"><h2 style="color:red;">500 |  Internal error detected!</h2> We will be back soon..</div>'
    );
  }
});

// port setting;
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"));
