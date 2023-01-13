const db = require('../../config/mongoose')
// (上1) 教案說，這是接收該路徑 export 出來，取名為 db 的資料
// 查過後，應這樣說，把該路徑 export 出來的資料，定義為 const db
// const 取甚麼名字都沒關係，都會得到 require 路徑 export 出來的資料 (變數、函數、或是其他)
const shop_json = require('./restaurant.json').results
const Shop = require('../shop_db_schema')

db.once('open', () => {
  // 因只會發生一次，所以用 once
  for (let i = 0; i < shop_json.length; i++) {
    Shop.create({
      id: shop_json[i].id,
      name: shop_json[i].name,
      name_en: shop_json[i].name_en,
      category: shop_json[i].category,
      image: shop_json[i].image,
      location: shop_json[i].location,
      phone: shop_json[i].phone,
      google_map: shop_json[i].google_map,
      rating: shop_json[i].rating,
      description: shop_json[i].description,
    })
  }
  console.log('Import data to DB. Done.')
})
