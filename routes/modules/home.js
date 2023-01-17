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
  const cssName = 'index'
  const sortNameInDropDown = '--'
  // (下) 拿到 DB 內的店家資料並渲染
  Shop.find()
    .lean()
    .then(shops => res.render('index', { cssName, shops: shops, sortNameInDropDown }))
    .catch(error => console.error(error))
})

// router.post('/', (req, res) => {
//   const cssName = 'index'
//   console.log('post request 進行中')
//   const sort = req.body.sort
//   console.log(sort)

//   const sortName =
//     sort === '_id-asc' ? '原始排列' :
//       sort === '_id-desc' ? '原始排列 (反向)' :
//         sort === 'name-asc' ? '店名首字筆畫 (多->少)' :
//           sort === 'name-desc' ? '店名首字筆畫 (少->多)' :
//             '--:'
//   const sortArray = sort.split('-')
//   // const sequence = {sort[0]: sort[1]} // 這寫法不行，要用下2行才行
//   const sequence = {}
//   sequence[sortArray[0]] = sortArray[1]
//   Shop.find()
//     .lean()
//     .sort(sequence) // 只要 () 內的是正確的 object (例：{_id: desc})，就算輸入變數也沒關係
//     .then(shops => res.render('index', { cssName, shops: shops, sortName }))
//     .catch(err => console.error(err))
// })

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
