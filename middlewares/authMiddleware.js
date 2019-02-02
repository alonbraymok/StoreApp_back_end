const express = require('express')
const jwt = require('jwt-simple')
const Users = require('../models/Users')
const {errResult, okResult} = require('../utils/httpResult')
const {userEncoder, userDecoder} = require('../utils/jwtHandler')


const authMiddleware = (req, res, next) => {
    const user = userDecoder(req.headers.jwttoken)
    if (user) {
        Users.findOne(user, (err, user) => {
            if (err) {
                res.json(errResult(err))
            } else if (user) {
                req.user = user
                next();
            }
        })
    } else {
        res.json(errResult('please login.'))
    }
} 

const adminMiddleware = (req, res, next) => {
    if (req.user.isAdmin) {
        console.log('ok....')
        next();
    } else {
        res.json(errResult('you are not an admin.'))
    }
}

module.exports = {
    adminMiddleware,
    authMiddleware
}