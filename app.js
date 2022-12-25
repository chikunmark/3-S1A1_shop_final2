const express = require('express')
const app = express() // 為什麼不把這兩行直接合成 const app = require('express')，試了，就是不行，官網也沒說原因，隨便 (攤手)
// 試試
const port = 8080
const exphbs = require('express-handlebars') // require handlebars

const methodOverride = require('method-override')
// 設定每一筆請求都會透過 methodOverride 進行前置處理 (這啥意思？)
// P.S. 好像得擺在 bodyParser 之後，先擺這試試，看會怎樣
app.use(methodOverride('_method'))
// 上面 _method 是參數，也能改成其他字，代表一遇到 '' 內的字，就會將 HTTP method 換成 _method 的值 (例： ?_method=delete，form 裡面的 HTTP method 就會換成 delete)

require('./config/mongoose') // 引用 mongoose 與相關設定，反正不論如何都要引用，且輸入的 code 中，只用這一次，所以不設變數了

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // 我猜是指 指定模板引擎，並指定副檔名
app.set('view engine', 'handlebars')
// 上面兩行不知詳細意義，再查

// setting static file 是啥意呢？
app.use(express.static('public'))
// 只知道是導入 public 資料夾，導入 JS, CSS 等，但裡面的 static 到底是啥意呢？
app.use(express.urlencoded({ extended: true })) // 藉 express 內建的 body parser 分析 post 內容

const routes = require('./routes/index')
// (上1) 引用總路由檔 index.js (教案說引入路由器)，
// 可不寫 /index，因為預設會去找它
app.use(routes)
// (上1) 所有的路由
// 以 routes 為參數，使用 app (express) 這個套件 (導入 index.js 的路由)

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})
