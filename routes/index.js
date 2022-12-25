const express = require('express')
const router = express.Router()

// 引用 home.js (教案說引入 home 模組程式碼，差別在哪？)
const home = require('./modules/home')
// (下) 使用 router 這個變數：
// 遇到 '/' 這個路徑，就導到 home 去 (這寫法跟 app.get 這種 listening 的機制頗像)
router.use('/', home)

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
