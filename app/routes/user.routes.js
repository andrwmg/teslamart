const express = require('express')
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const { isLoggedIn, isLoggedInTwo } = require('../../middleware');
const users = require('../controllers/user.controller');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({storage})

router.post('/register', users.registerTwo)

router.post('/login', users.loginTwo) 

//     function (req, res, next) {
//         try {
//         passport.authenticate('local', function (err, user, info) {
//             if (err) { return next(err) }
//             if (!user) {
//                 return res.send({ message: info.message, messageStatus: 'error' });
//             }
//             if (!user.isVerified) {
//                 return res.send({ message: 'Account not verified. Please check email.', messageStatus: 'error'})
//             }
//             req.login(user, loginErr => {
//                 if (loginErr) {
//                   return next(loginErr);
//                 }
//                 return res.send({ user: user, success : true, message : 'Welcome back to Tesla Mart!', messageStatus: 'success' });
//               });
//         })(req,res,next);
//     }
//  catch (err) {
//     return res.send({message : 'Error when trying to log in', messageStatus: 'error' })(req,res,next);
// }})


router.post('/getUser', isLoggedInTwo, users.getUser)

router.get('/verify/:token', users.verify)

router.post('/resend', users.resendTwo)

router.post('/forgot', users.forgot)

router.post('/reset/:token', users.resetTwo)

router.put('/updateUser/:id', users.updateUser)

router.put('/messages/:fromId/:toId', isLoggedInTwo, users.sendMessage)

// router.post('/login', passport.authenticate('local'), users.login)

// // Retrieve all published Tutorials
router.get('/logout', users.logoutTwo)

// app.use('/api/users', router);

module.exports = router
