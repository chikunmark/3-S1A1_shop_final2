const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FBStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
      // (上1) 'usernameField' 只能用這名，不能改
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('warning_msg', 'This email is not registered.'))
            // return done(null, false, { message: 'This email is not registered.' }) // 教案的
          }
          return bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Email or Password is incorrect.'))
              // return done(null, false, { message: 'Email or Password is incorrect.' })
            }
            return done(null, user)
          })
        })
        .catch(err => done(err, false))
    })
  )

  passport.use(
    new FBStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        // 若是 localhost, 不回 FB 設白名單也行
        // FB 到時會幫我們把這段塞進瀏覽器的 url 上 (不是很懂) -> 我認為，應該是 FB 會把資訊丟回上列路由唄
        profileFields: ['email', 'displayName'],
      },
      (accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        const { name, email } = profile._json
        User.findOne({ email }).then(user => {
          if (user) return done(null, user)

          const randomPassword = Math.random().toString(36).slice(-8)

          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({ name, email, password: hash }))
            .then(user => done(null, user))
            .catch(err => done(err, false))
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id) // 在 mongoose 裡，id 就是 _id
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null)) // 雖然遇到 err，就不會處理後面參數，加上 null 是為表達 user 是空的
  })
}
