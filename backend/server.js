const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require('crypto')
const session = require('express-session');
const User = require('./app/models/user.model')
const SQLiteStore = require('connect-sqlite3')(session);
const methodOverride = require('method-override')


passport.use(new LocalStrategy(User.authenticate()))

const app = express()

const db = require("./app/models/index.js");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    // useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

let corsOptions = {
  origin: "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// simple route
// app.get("/", (req, res) => {
//     res.json({ message: "Welcome to bezkoder application." });
//   });

const sessionConfig = {
    name: 'session',
    secret:"Squirrels!!!",
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    // secure:true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const listingRoutes = require("./app/routes/listing.routes");
const commentRoutes = require("./app/routes/comment.routes");
const userRoutes = require("./app/routes/user.routes");

app.use((req,res,next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/api', userRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/listings/:id/comments', commentRoutes)


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
