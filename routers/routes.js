const router = require('express').Router()
const { login, register, getKampanyalar, addKampanya, addOgrenci, getTotalBudget, getTotalSpend, getEklenen, getNewKampanya, getTotalBasvuru, getTotalKatilimci, getTotalKayit, etkinlik_getir, getKampanyaByKanal, kanalGraf, butceGraf, kampanyaGraf, etGraf } = require('../controllers/controller')




router.post("/login", login)
router.post("/register", register)
router.get('/kampanyalar', getKampanyalar)
router.post("/kampanyalar", addKampanya)
router.post("/kayit", addOgrenci)
router.get('/kayit', getEklenen)
router.get('/totalBudget', getTotalBudget);
router.get('/totalSpend', getTotalSpend);
router.get('/campaign-list', getNewKampanya);
router.get('/totalBasvuru', getTotalBasvuru)
router.get('/totalKatilimci', getTotalKatilimci)
router.get('/totalKayit', getTotalKayit)
router.get("/etkinlik_getir", etkinlik_getir)
router.get("/getKampanyaByKanal", getKampanyaByKanal)
router.get("/kanalGraf", kanalGraf)
router.get("/butceGraf", butceGraf)
router.get("/kampanyaGraf", kampanyaGraf)
router.get("/etGraf", etGraf)



























module.exports = router










