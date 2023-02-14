const express = require('express')
const router = express.Router()
const Shop = require('../../models/shop_db_schema')
// (上) 引入資料架構
// 只是因為下面的 'Shop' 需要用到，所以引入
// 那怪了，明明也需要渲染頁面，為啥沒引入 express-handlebars??
// 還是說，只要是沒直接 key 在這的檔案的變數、函數，不輸入也沒關係，只要引用它的檔案有輸入(設定好)就好？
// 照助教說法，不須再引入 handlebars，純粹是語法，沒有 "原理上" 的原因

// 搜尋、排序功能、路由
router.get('/search', (req, res) => {
  // console.log('小寫搜尋', req.query.keyword.toLocaleLowerCase())
  const cssName = 'index'
  const wordForSearch = req.query.keyword.trim().toLocaleLowerCase()
  const sort = req.query.sort || '_id-asc'
  // console.log(sort)

  const sortNameInDropDown = sort => {
    // (上1)若輸入 sort 作為參數名，不知為何會相衝到，造成 sortName[sort] 值變成 undefined
    const sortName = {
      '_id-asc': '原始排列',
      '_id-desc': '原始排列 (反向)',
      'name-asc': '店名首字排序 (小->大)',
      'name-desc': '店名首字排序 (大->小)',
      'location-asc': '地址首字排序 (小->大)',
      'location-desc': '地址首字排序 (大->小)',
    }
    return sortName[sort] || '--'
  }

  const sortArray = sort.split('-')
  // const sequence = {sort[0]: sort[1]} // 這寫法不行，要用下2行才行
  const sequence = {}
  sequence[sortArray[0]] = sortArray[1]

  // 若沒關鍵字，返回首頁
  if (!wordForSearch && !sort) {
    return res.redirect('/')
  }

  // 答案是從 DB 取下來再處理，我原本是想直接在 DB 找到相符的再取下來
  return Shop.find()
    .lean()
    .sort(sequence) // 只要 () 內的是正確的 object (例：{_id: desc})，就算輸入變數也沒關係
    .then(shopArray => {
      // 上面的 shopArray，是 Shop 經過.find().lean().then() 之後自動生成的結果，是個陣列，我不知為何以陣列形式呈現，反正是這樣。
      // 不論改成 .find().lean() 或 .find().lean().then() 都沒法產生該陣列，必須要寫成現在這樣，才能把數據導出
      const filtershopData = shopArray.filter(data => data.name.toLowerCase().includes(wordForSearch) || data.category.includes(wordForSearch))
      res.render('index', { shops: filtershopData, keyword: req.query.keyword, cssName, sort, sortNameInDropDown: sortNameInDropDown(sort) })
      // 上面的 sortNameInDropDown 要考慮要留 (sort) -> 去掉的話，會長得更像變數 (雖是函數)
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
    .then(shopArray => res.render('show', { cssName, shop: shopArray }))
    .catch(err => console.error(err)) // 為何不省略函式，直接寫 console.log(err) ??
})

// 顯示新增店家頁面
router.get('/newshop', (req, res) => {
  const cssName = 'show'
  const title = '新增一間餐廳'
  const action = '/create-new-record'
  res.render('edit', { cssName, title, action })
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
        res.render('edit', { shop, title, action, cssName })
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

// 把結果匯出路由器，雖不知為何不能寫成 module.exports = express.Router()
module.exports = router
