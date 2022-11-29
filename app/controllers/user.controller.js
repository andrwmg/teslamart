const express = require('express');
const db = require('../models/index.js')
const User = db.users
// const passport = require('passport');

exports.register = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;
        const user = new User({ email, username, image: image[0] })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, e => {
            if (e) { 
                res.send({message: e.message, messageStatus: 'error'})
            }
        })
            res.send({user: registeredUser, message: 'Registration successful! Welcome to Tesla Mart!', messageStatus: 'success'})
       
    }
    catch (e) {
        if (e.message.includes('E11000')) {
            res.send({message: 'A user with the given email is already registered', messageStatus: 'error'})
        } else{
        res.send({message: e.message, messageStatus:'error'});
    }}
}

exports.login =  ((req, res, err) => {
    if (err) {
        res.send({ message: err.message, messageStatus:'error'})
    } else {
    res.send({user: req.user, message:'Welcome back to Tesla Mart!', messageStatus:'success'})
    }
 })
 

exports.getUser = async (req,res) => {
    if (req.user){
    const user = await User.findById(req.user._id)
    res.send(user)
    }
}

exports.updateUser = async (req,res) =>{
    const {id} = req.params
const {_id} = req.user
if (id === _id.toString()) {
User.findByIdAndUpdate(id, req.body)
.then(data => {
  if (!data) {
    res.status(404).send({
      message: `Cannot update Profile with id=${id}. Maybe User was not found!`, messageStatus: 'error'
    });
  } else res.send({ message: "Profile was updated successfully.", messageStatus: 'success' });
})
.catch(err => {
  res.status(500).send({
    message: "Error updating Profile with id=" + id, messageStatus: 'error'
  });
});
}
}

exports.logout = (req,res)=> {
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