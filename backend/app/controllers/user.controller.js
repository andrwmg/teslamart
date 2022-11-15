const db = require('../models/index.js')
const User = db.users
const passport = require('passport');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        // res.redirect('/listings')
        req.login(registeredUser, err => {
            if (err) { return next(err); }
        })
    }
    catch (e) {
        res.send('error', e.message);
    }
}

exports.login =  ((req, res, next) => {
    console.log('Hello There!')
 })
 

exports.getUser = (req,res) => {
    if(req.user) {
        res.json(req.user)
        console.log(req.user)
    }
    
    console.log(req.user)
}

exports.logout = (req,res,next)=> {
    console.log(req)
    console.log("HOLA!")
    req.logout(err => {
        console.log(err)
    })
    // res.send(req.user)
}