const db = require('../../config/mongoose')
const shop_json = require('./restaurant.json').results
const Shop = require('../shop_db_schema')
const User = require('../user')
const bcrypt = require('bcryptjs')

const SEED_USER = [
  { email: 'user1@example.com', password: '12345678', ownedDataIndex: [0, 1, 2] },
  { email: 'user2@example.com', password: '12345678', ownedDataIndex: [3, 4, 5] },
]

db.once('open', () => {
  Promise.all(
    Array.from({ length: 1 }, () => {
      SEED_USER.forEach(seed_user => {
        User.findOne({ email: seed_user.email }).then(user => {
          if (user) {
            console.log('此 email 已被註冊，故不建立')
          } else {
            bcrypt
              .genSalt(10)
              .then(salt => bcrypt.hash(seed_user.password, salt))
              .then(hash =>
                User.create({
                  email: seed_user.email,
                  password: hash,
                })
              )
              .then(user => {
                const userId = user._id
                seed_user.ownedDataIndex.forEach(shopIndex => {
                  shop_json[shopIndex].userId = userId
                  return Promise.all(Array.from({ length: 1 }, () => Shop.create(shop_json[shopIndex])))
                })
              })
          }
        })
      })
    })
  )
  // 還是沒成，之後再試
  // .then(() => {
  //   console.log('done')
  //   process.exit() // NODE 提供的 fn.，結束 terminal，相當於 Ctrl+C
  // })
})
