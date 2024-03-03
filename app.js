const express = require('express')
const router = require('./routers')
const path = require("path")
require('dotenv/config')
const app = express()


app.use(express.static(path.join(__dirname,"public")))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "/public/login.html"))
})



//Midllewares
app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use('/api', router)
app.use('/images', express.static('../kds-proje/images/index_main.jpg'));

app.listen(process.env.PORT)























// app.get('/kayit', function (req, res) {
//   res.sendFile(path.join(__dirname, "/kayit.html"))
// })
// app.get('/grafik', function (req, res) {
//   res.sendFile(path.join(__dirname, "/grafik.html"))
// })
// app.get('/etkinlik', function (req, res) {
//   res.sendFile(path.join(__dirname, "/etkinlik.html"))
// })
// app.get('/register', function (req, res) {
//   res.sendFile(path.join(__dirname, "/register.html"))
// })
// app.get('/login', function (req, res) {
//   res.sendFile(path.join(__dirname, "/login.html"))
// })