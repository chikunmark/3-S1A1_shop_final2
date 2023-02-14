module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next() // 如果有這個，就會進到下一個 fn.，以這來說，下一個 fn. 可在 index.js 裡看到
    }
    req.flash('warning_msg', '請先登入才能使用')
    res.redirect('/users/login')
  },
}
