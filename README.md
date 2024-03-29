# 打造餐廳清單

本專案以練習路由、handlebars 為主要目的，並提供推薦餐廳的清單。  
點擊餐廳內容框，會跳出店家的進一步介紹，並有附上搜尋功能 (如下連結圖示)。  
![簡圖](readme_pics/example1.jpg)  
敬請自由使用。

## 如何才能使用

1. 開啟終端機 (git Bash / Terminal / console)，並 cd 至您想擺放專案的位置
2. 執行

```
git clone https://github.com/chikunmark/3-S1A1_shop_final2.git
```

3. 安裝必要套件、並初始化

3.1 進入專案資料夾

```
cd 3-S1A1_shop_final2
```

3.2 安裝必要套件

```
npm install
```

3.3 本專案有使用環境變數，請參考檔案 .env.example，建立您的變數 (.env 檔)，  
 下圖為範例，請參考並使用 mongoose 連接 MongoDB，  
 在當下目錄建立檔案，連結到您的 MongoDB 的 URI  
 ![.env demo](readme_pics/example2.jpg) 3.3 執行 seeder.js (輸入資料)

```
npm run seed
```

3.4 執行環境

```
npm run dev
```

4. 開啟瀏覽器 (Chrome, Firefox 等)，並進入以下網址，即可使用本專案

```
http://localhost:3000
```

5. 若遇停止環境 (停用專案)，請在終端機按下 Ctrl + C (windows)，或其 OS 的相應按鍵

謝謝您！

## 使用工具、套件

- Node.js@18.12.0
- npm@8.19.2
- express@4.18.2
- express-handlebars@4.0.3
- mongoose@5.9.13
- body-parser@1.20.1 (內建於 express，直接使用其功能)
- bcryptjs@2.4.3
- connect-flash@0.1.1
- express-session@1.17.1
- method-override@3.0.0
- passport@0.4.1
- passport-facebook@3.0.0
- passport-local@1.0.0"
- dotenv@16.0.3
