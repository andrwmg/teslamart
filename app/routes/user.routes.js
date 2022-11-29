const express = require('express')
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const { isLoggedIn } = require('../../middleware');
const users = require('../controllers/user.controller');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})

router.post('/register',  users.register)

router.post('/login', 
// passport.authenticate('local', 
// {failureMessage:true}),
    function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                return res.send({ message: info.message, messageStatus: 'error' });
            }
            req.login(user, loginErr => {
                if (loginErr) {
                  return next(loginErr);
                }
                return res.send({ user: user, success : true, message : 'Welcome back to Tesla Mart!', messageStatus: 'success' });
              });
        })(req,res,next);
    }
    // // ,
    // users.login
);

router.get('/getUser', isLoggedIn, users.getUser)

router.put('/updateUser/:id',(req,res,next)=>{console.log('Here we go!'); next()}, users.updateUser)

// router.post('/login', passport.authenticate('local'), users.login)

// // Retrieve all published Tutorials
router.get('/logout', users.logout)

// app.use('/api/users', router);

module.exports = router
