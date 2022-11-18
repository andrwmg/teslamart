const express = require('express')
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const { isLoggedIn } = require('../../middleware');
const users = require('../controllers/user.controller');

    router.post('/register', users.register)
  
    router.post('/login', 
    // passport.authenticate('local'
    // // , (req, res, next) => {
    // //         // handle success
    // //         if (req.xhr) { return res.json({ id: req.user.id }); }
    // // }
    // ,
    // {session: false}),
    passport.authenticate('local'),
    users.login
     );

    router.get('/getUser', users.getUser)


    // router.post('/login', passport.authenticate('local'), users.login)
  
    // // Retrieve all published Tutorials
    router.get('/logout', users.logout)
  
    // app.use('/api/users', router);
  
    module.exports = router
