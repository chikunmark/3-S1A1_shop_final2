const express = require('express')
const router = express.Router()

const Shop = require('../../models/shop_db_schema')
// (上) 引入資料架構
// 只是因為下面的 'Shop' 需要用到，所以引入
// 那怪了，明明也需要渲染頁面，為啥沒引入 express-handlebars??
// 還是說，只要是沒直接 key 在這的檔案的變數、函數，不輸入也沒關係，只要引用它的檔案有輸入(設定好)就好？

// 首頁的路由
// app.get('/', (req, res) => { // 舊的，是在 app.js 內，用 app 作為變數
router.get('/', (req, res) => {
  // 上面是新的，配合這個檔案，把 app 改成 router，不過變數細節有差別如下，用起來沒差，但未知細部差別
  // 新的 const router = express.Router()
  // 舊的 const app = express()
  const userId = req.user._id
  const cssName = 'index'
  const sortNameInDropDown = '--'
  Shop.find({ userId })
    .lean()
    .then(shops => res.render('index', { cssName, shops: shops, sortNameInDropDown }))
    .catch(error => console.error(error))
})

module.exports = router
