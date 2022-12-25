const mongoose = require('mongoose')
// 敏感資料，之後移動
const MONGODB_URI = 'mongodb+srv://alpha:camp@cluster0.ke4xjxv.mongodb.net/S2A7-shop-list?retryWrites=true&w=majority'
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection
// const aaa = 'Say hello'

db.on('error', () => {
  console.log('mongodb error!!')
})
db.once('open', () => {
  // 因只會發生一次，所以用 once
  console.log('mongoDB connected!!')
})

module.exports = db // 教案說：這是把 db export 出來
// module.exports = aaa // exprot 多個變數，還沒試乘，等下繼續試
