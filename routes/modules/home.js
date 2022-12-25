const express = require('express')
const router = express.Router()

const Shop = require('../../models/shop_db_schema') // 引入資料架構

// 首頁的路由
// app.get('/', (req, res) => { // 舊的，是在 app.js 內，用 app 作為變數
router.get('/', (req, res) => {
  // 上面是新的，配合這個檔案，把 app 改成 router，不過變數細節有差別如下，用起來沒差，但未知細部差別
  // 新的 const router = express.Router()
  // 舊的 const app = express()
  const cssName = 'index'
  // 拿到 DB 內的店家資料並渲染
  Shop.find()
    .lean()
    .then(shops => res.render('index', { name: cssName, shops: shops }))
    .catch(error => console.error(error))
})

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
