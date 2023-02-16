const express = require('express')
const router = express.Router()

const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  const cssName = 'index'
  res.render('login', { cssName })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureMessage: true,
    failureRedirect: '/users/login',
    // 若寫成 'users/login' 或 './users/login'，最後都會 redirect 到 ...:3000/users/users/login
  })
)

router.get('/register', (req, res) => {
  const cssName = 'index'
  res.render('register', { cssName })
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位皆為必填' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不同。' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '此 email 已被註冊' })
      return res.render('register', { errors, name, email, password, confirmPassword })
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({ name, email, password: hash }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出')
  res.redirect('/users/login')
})

module.exports = router
