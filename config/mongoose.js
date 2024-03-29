// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }) // 設定連線到 mongoDB
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!!')
})
db.once('open', () => {
  // 因只會發生一次，所以用 once
  console.log('mongoDB connected!!')
})

module.exports = db // 教案說：這是把 db export 出來
