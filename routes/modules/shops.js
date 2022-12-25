const express = require('express')
const router = express.Router()
const Shop = require('../../models/shop_db_schema')
// (上) 引入資料架構
// 只是因為下面的 'Shop' 需要用到，所以引入
// 那怪了，明明也需要渲染頁面，為啥沒引入 express-handlebars??
// 還是說，只要是沒直接 key 在這的檔案的變數、函數，不輸入也沒關係，只要引用它的檔案有輸入(設定好)就好？

// 搜尋功能、路由
router.get('/search', (req, res) => {
  // console.log('小寫搜尋', req.query.keyword.toLocaleLowerCase())
  const cssName = 'index'
  const wordForSearch = req.query.keyword.trim().toLocaleLowerCase()

  // 若沒關鍵字，返回首頁
  if (!wordForSearch) {
    return res.redirect('/')
  }

  // 答案是從 DB 取下來再處理，我原本是想直接在 DB 找到相符的再取下來
  Shop.find()
    .lean()
    .then(shopArray => {
      // 上面的 shopArray，是 Shop 經過.find().lean().then() 之後自動生成的結果，是個陣列，我不知為何以陣列形式呈現，反正是這樣。
      // 不論改成 .find().lean() 或 .find().lean().then() 都沒法產生該陣列，必須要寫成現在這樣，才能把數據導出
      const filtershopData = shopArray.filter(data => data.name.toLowerCase().includes(wordForSearch) || data.category.includes(wordForSearch))
      res.render('index', { shops: filtershopData, keyword: req.query.keyword, name: cssName })
    })
    .catch(err => console.log(err))
})

// 顯示單一店面細節
router.get('/restaurants/:_id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const _id = req.params._id // 目前變數命名成 "_id" 沒問題，先繼續試

  Shop.findById(_id)
    .lean()
    .then(shopArray => res.render('show', { name: cssName, shop: shopArray }))
    .catch(err => console.error(err)) // 為何不省略函式，直接寫 console.log(err) ??
})

// 顯示新增店家頁面
router.get('/newshop', (req, res) => {
  const cssName = 'show'
  const title = '新增一間餐廳'
  const action = '/create-new-record'
  res.render('edit', { name: cssName, title, action })
})

// 傳送新增資料
router.post('/create-new-record', (req, res) => {
  // console.log(req.body)
  return Shop.create(req.body)
    .then(res.redirect('/'))
    .catch(err => console.error(err))
})

// 顯示 edit 頁面資料
router.get('/restaurants/edit/:_id', (req, res) => {
  // console.log(req.params.id)
  const cssName = 'show'
  const title = '編輯餐廳細節'
  const _id = req.params._id
  const action = `/update/${_id}?_method=PUT`
  return (
    Shop.findById(_id)
      .lean()
      // .then(shop => console.log(shop))
      .then(shop => {
        // console.log(shop) //檢查用
        res.render('edit', { shop, title, action, name: cssName })
      })
  )
})

// 送出更新餐廳資料
router.put('/update/:_id', (req, res) => {
  const updateArray = req.body
  const _id = req.params._id

  // 老方法，有用，但很冗
  // return Shop.findById(_id)
  //   .then(shop => {
  //     shop.name = updateArray.name
  //     shop.name_en = updateArray.name_en
  //     shop.category = updateArray.category
  //     shop.image = updateArray.image
  //     shop.location = updateArray.location
  //     shop.phone = updateArray.phone
  //     shop.google_map = updateArray.google_map
  //     shop.rating = updateArray.rating
  //     shop.description = updateArray.description
  //     return shop.save()
  //   })
  //   .then(res.redirect(`/restaurants/${_id}`))
  //   .catch(err => console.error(err))

  // 解答的方法 (超簡潔齁，以前沒教 TAT)
  return Shop.findByIdAndUpdate(_id, updateArray)
    .then(res.redirect(`/restaurants/${_id}`))
    .catch(err => console.error(err))
})

// 刪除餐廳功能 (先用 method = post)
router.delete('/restaurants/:_id', (req, res) => {
  const _id = req.params._id
  return Shop.findById(_id) // 從 DB 的 "_id" 去尋找
    .then(shop => shop.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// 排序
// router.get('/shops/sort/:type', (req, res) => {
//   // <a> method 改成 put 沒成功，等下繼續試
//   const type = req.params.type
//   console.log('type 裡的字是', type)
//   let aaa = ''

//   if (type === `name_from_high`) {
//     sequence = Shop.find()
//       .lean()
//       .sort({ name: 'desc' })
//       .then(aaa => console.log(aaa))
//   } else if (type === `name_from_low`) {
//     sequence = Shop.find()
//       .lean()
//       .sort({ name: 'asc' })
//       .then(aaa => console.log(aaa))
//   }
// console.log(sequence)

// Shop.find()
//   .lean()
//   .then(shop => {
//     if (type === `name_from_high`) {
//       console.log(shop)
//       const sort = shop.sort({ name: 'desc' })
//       console.log(sort)
//     } else if (type === `name_from_low`) {
//       console.log(shop)
//       const sort = shop.sort({ name: 'asc' })
//       console.log(sort)
//     }
//   })
//   .then(res.redirect('/'))
//   .catch(err => console.error(err))
// })

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
