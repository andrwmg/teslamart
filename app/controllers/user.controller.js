const express = require('express');
const db = require('../models/index.js')
const User = db.users
// const passport = require('passport');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, e => {
            if (e) { 
                res.send({message: e.message, messageStatus: 'error'})
            }
        })
            res.send({user: registeredUser, message: 'Registration successful! Welcome to Tesla Mart!', messageStatus: 'success'})
       
    }
    catch (e) {
        res.send({message: e.message, messageStatus:'error'});
    }
}

exports.login =  ((req, res, next) => {
    res.send({user: req.user, message:'Welcome back!', messageStatus:'success'})
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
    try{
    req.logout(err => {
        if (!err) {
        res.send({message: 'Successfully logged out', messageStatus:'success'})
        } else {
            res.send({message: e.message, messageStatus: 'error'})
        }
    })} catch (e) {
        res.send({message: e.message, messageStatus: 'error'})
    }
    // res.send(req.user)
}