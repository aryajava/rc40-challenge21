var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("connect-flash");
var session = require("express-session");
var fileupload = require("express-fileupload");

var loginRouter = require("./routes/login");
var todoRouter = require("./routes/todo");
var userRouter = require("./routes/user");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/vendor", express.static(path.join(__dirname, "public/vendor")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use("/fontawesome", express.static(path.join(__dirname, "node_modules/@fortawesome/fontawesome-free")));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(
  session({
    secret: "CdZE5vcRS5yjVL3IWPJk44WeqLQcflzZ",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(
  fileupload({
    createParentPath: true,
  })
);

app.use("/", loginRouter);
app.use("/todos", todoRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

