const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
  })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    // 若寫成 'users/login' 或 './users/login'，最後都會 redirect 到 ...:3000/users/users/login
  })
)

module.exports = router
