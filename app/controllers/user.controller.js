const express = require('express');
const db = require('../models/index.js')
const User = db.users
const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt')

const sgAPI = process.env.SENDGRID_API_KEY
const sgSMTP = process.env.SENDGRID_SMTP
const sgUser = process.env.SENDGRID_USERNAME
const sgPassword = process.env.SENDGRID_PASSWORD

sgMail.setApiKey(sgAPI)

async function sendToken(userEmail, verificationToken, type) {

    let subject = null
    let text = null

    const baseURL = process.env.LOCAL ? 'http:\/\/localhost:8081' : 'https:\/\/www.teslamartv2test.herokuapp.com'

    if (type === 'verify') {
        subject = 'Tesla Mart Account Verification Token'
        text = `Please verify your new Tesla Mart account by clicking the link: \n${baseURL}\/verify\/${verificationToken}\n`
    } else {
        subject = 'Tesla Mart Password Reset Token'
        text = `Please reset your Tesla Mart password by clicking the link: \n${baseURL}\/reset\/${verificationToken}\n`
    }

    const mailOptions = {
        to: userEmail,
        from: sgUser,
        subject,
        text
    }

    sgMail.send(mailOptions)

}

exports.register = async (req, res, err) => {
    let { email, username } = req.body
    const { password, image } = req.body
    if (email && username) {
        email = email.toLowerCase()
        username = username.toLowerCase()
    }

    try {
        const existingUser = await User.find({ $or: [{ username }, { email }] })
        console.log(existingUser.length)
        if (existingUser.length) {
            res.send({ message: 'Username or email are already taken', messageStatus: 'error' });
            return;
        } else {

            const user = new User({ email, username, image: image[0] })
            const token = user.generateVerificationToken();

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.password = hash;

            user.save()

            sendToken(user.email, user.verificationToken, 'verify')

            res.status(200).json({ message: 'Verification email resent', messageStatus: 'success' })
        }
    }
    catch (e) {
        if (e.message.includes('E11000')) {
            res.send({ message: 'Failed to register user', messageStatus: 'error' })
        } else {
            res.send({ message: e.message, messageStatus: 'error' });
        }
    }
}

exports.verify = async (req, res, err) => {
    const { token } = req.params

    try {
        await User.findOneAndUpdate({ verificationToken: token }, { isVerified: true, verificationToken: null })
            .then(data => {
                if (!data) {
                    res.send({ message: 'Invalid verification token', messageStatus: 'error' });
                } else {
                    res.send({ message: 'Account verified', messageStatus: 'success' });
                }
            })
    }
    catch (err) {
        console.log(err)
        res.send({ message: 'Failed to verify account', messageStatus: 'error' });
    }
}

exports.resend = async (req, res, err) => {
    let { username } = req.body
    const { password } = req.body
    if (username) {
        username = username.toLowerCase()
    }    
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.send({ message: 'Invalid username or password', messageStatus: 'error' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.send({ message: 'Invalid username or password', messageStatus: 'error' });
        }
        if (user.isVerified) {
            return res.send({ message: 'Account is already verified', messageStatus: 'error' });
        }

        const token = user.generateVerificationToken()

        user.save()

        sendToken(user.email, user.verificationToken, 'verify')

        res.status(200).json({ message: 'Verification email resent', messageStatus: 'success' })

    } catch (e) {
        if (e.message.includes('E11000')) {
            res.send({ message: 'Failed to register user', messageStatus: 'error' })
        } else {
            res.send({ message: e.message, messageStatus: 'error' });
        }
    }
}

exports.login = async (req, res, err) => {
    let { username } = req.body
    const { password } = req.body
    if (username) {
        username = username.toLowerCase()
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.send({ message: 'Invalid username or password', messageStatus: 'error' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.send({ message: 'Invalid username or password', messageStatus: 'error' });
        }
        if (!user.isVerified) {
            return res.send({ message: 'Account not verified', messageStatus: 'error' });
        }
        req.session.user = user

        console.log(req.session)


        res.send({ token: req.session.cookie, user, message: 'Welcome back to Tesla Mart!', messageStatus: 'success' })

    } catch (err) {
        res.send({ message: 'Login failed', messageStatus: 'error' });
    }
}


exports.getUser = async (req, res, err) => {
    const { id } = req.body
    if (req.session.user && req.session.user._id === id) {
        const user = await User.findById(req.session.user._id)
            .populate({
                path: 'inbox',
                populate: [
                    { path: 'to' }, { path: 'from' }
                ]
            })
            .populate({
                path: 'outbox',
                populate: [
                    { path: 'to' }, { path: 'from' }
                ]
            })
        res.send(user)
    }
}

exports.forgot = async (req, res, err) => {
    let { email} = req.body
    if (email) {
        email = email.toLowerCase()
    }    
    try {
        const user = await User.findOne({ email })
        if (!user) {

            res.send({ message: 'Could not find account with that username', messageStatus: 'error' })

        } else {

            const token = user.generateResetToken()

            user.save((err) => {
                console.log(err)
            })

            sendToken(user.email, user.resetPasswordToken, 'reset')

            res.status(200).json({ message: 'Reset token resent', messageStatus: 'success' })

        }
    } catch (err) {
        console.log(err)
        res.send({ message: 'Failed to send reset password email', messageStatus: 'error' });
    }
}

exports.setToken = async (req, res) => {
    const { token } = req.params

    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            res.send({ message: 'Password reset token is invalid or has expired', messageStatus: 'error' });
        } else {
            req.session.token = token
            res.send({ message: 'Token accepted. Reset password now', messageStatus: 'success' })
        }
    }
    catch (err) {
        console.log(err)
        return res.send({ message: 'Failed to reset password', messageStatus: 'error' });
    }
}

exports.reset = async (req, res) => {
    const { token } = req.session
    const { password } = req.body

    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.send({ message: 'Password reset token is invalid or has expired', messageStatus: 'error' });
        } else {
            const saltRounds = 10;

            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) {
                    return next(err);
                } else { }
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.send({ message: 'Password reset token is invalid or has expired', messageStatus: 'error' });
                    }
                    user.password = hash;
                    user.resetPasswordToken = null;
                    user.resetPasswordExpires = null;
                    user.save((err) => {
                        if (!err) {
                            return res.send({ message: 'Password reset successful', messageStatus: 'success' });
                        } else {
                            return res.send({ message: 'Password reset failed', messageStatus: 'error' });
                        }
                    })
                })
            })
        }
    }
    catch (err) {
        console.log(err)
        return res.send({ message: 'Failed to reset password', messageStatus: 'error' });
    }
}


exports.updateUser = async (req, res) => {
    const { id } = req.params
    const { _id } = req.session.user
    if (id !== _id) {
        res.status(500).send({
            message: "Error updating Profile with id=" + id, messageStatus: 'error'
        })
    } else {
        const user = await User.findByIdAndUpdate(id, req.body, { returnOriginal: false, new: true })
        if (!user) {
            res.status(404).send({
                message: `Cannot update Profile with id=${id}. Maybe User was not found!`, messageStatus: 'error'
            });
        } else {
            res.send({ image: req.body.image, message: "Profile was updated successfully.", messageStatus: 'success' });
        }
    }
}

exports.sendMessage = async (req, res) => {
    const { fromId, toId } = req.params
    if (fromId === toId) {
        res.send({ message: 'This is your listing! Cannot message yourself', messageStatus: 'error' })
    } else {
        const { _id } = req.session.user

        if (fromId === _id) {
            const sender = await User.findById(fromId).populate('outbox')
            const recipient = await User.findById(toId).populate('inbox')
            sender.outbox.push(req.body)
            recipient.inbox.push(req.body)
            await sender.save()
            await recipient.save()
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot send message to id=${toId}. Maybe User was not found!`, messageStatus: 'error'
                        });
                    } else res.send({ message: "Message was sent successfully.", messageStatus: 'success' });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error sending message", messageStatus: 'error'
                    });
                });
        }
    }
}

exports.logout = (req, res, err) => {
    try {
        req.session.destroy();
        res.send({ message: 'Successfully logged out', messageStatus: 'success' })
    } catch (err) {
        res.send({ message: err.message, messageStatus: 'error' })
    }
}