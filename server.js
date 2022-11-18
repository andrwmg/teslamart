const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require('crypto')
const session = require('express-session');
const User = require('./app/models/user.model')
const SQLiteStore = require('connect-sqlite3')(session);
const methodOverride = require('method-override')
const MongoStore = require("connect-mongo")


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

app.use(express.static(path.join(__dirname, 'build')));

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/tesla';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'Help!!!'
  }
});

const sessionConfig = {
    store,
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

app.use('/data', userRoutes)
app.use('/data/listings', listingRoutes)
app.use('/data/listings/:id/comments', commentRoutes)

app.get('/api', (req,res) => {
  res.json({
    message: 'This is the api endpoint'
  })
})

app.get('/*', (req,res)=> {
  res.sendFile(path.join(__dirname, 'build','index.html'))
})




// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
