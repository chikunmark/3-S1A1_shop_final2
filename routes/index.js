const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const shops = require('./modules/shops')
const users = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)
// (下1) 自己試的：猜想意思，不論如何，就使用 shops 這個變數 (結論上成功)
// 因為裡面路由細節太亂，就不額外加條件了 (有點偷懶)
router.use(authenticator, shops)

module.exports = router
