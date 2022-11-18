const db = require('../models/index.js')
const User = db.users
// const passport = require('passport');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
res.send(registeredUser)        // req.login(registeredUser, err => {
        //     if (err) { return next(err); }
        // })
    }
    catch (e) {
        res.send(e.message);
    }
}

exports.login =  ((req, res, next) => {
    res.send(req.user)
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