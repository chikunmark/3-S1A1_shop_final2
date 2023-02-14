const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars') // require handlebars
const flash = require('connect-flash')

// 若不是生產環境，使用 dotenv (套件)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes/index')
// (上1) 引用總路由檔 index.js (教案說引入路由器)，
// 可不寫 /index，因為預設會去找它
require('./config/mongoose')
const usePassport = require('./config/passport')

const methodOverride = require('method-override')
// P.S. 好像得擺在 bodyParser 之後，先擺這試試，看會怎樣

const app = express()
const PORT = process.env.PORT

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(
  session({
    secret: process.env.SESSION_SECRET, // 這參數是 session 用來驗證 session id 的字串，由我們設定，可改成隨機的一個字串
    resave: false, // 若為 true，每次有新的 request，就會把 session 更新到 session store，然後蓋過去
    saveUninitialized: true, // 若為 true，強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的而且沒有被修改過，例如未登入的使用者的 session。
  })
)

app.use(express.urlencoded({ extended: true })) // 藉 express 內建的 body parser 分析 post 內容
app.use(methodOverride('_method'))
// 上面 _method 是參數，也能改成其他字，代表一遇到 '' 內的字，就會將 HTTP method 換成 _method 的值 (例： ?_method=delete，form 裡面的 HTTP method 就會換成 delete)
app.use(express.static('public'))
// 只知道是導入 public 資料夾，導入 JS, CSS 等，但裡面的 static 到底是啥意呢？

usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(routes)
// (上1) 所有的路由
// 以 routes 為參數，使用 app (express) 這個套件 (導入 index.js 的路由)

app.listen(PORT, () => {
  console.log(`Express is listening on http://localhost:${PORT}`)
})
