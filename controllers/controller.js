const dbConn = require("../db/mysql_connect")
const bcrypt = require("bcrypt")
const Response = require("../utils/response")




const login = async (req, res) => {
    const kullanici_adi = req.body.kullanici_adi
    const sifre = req.body.sifre
    dbConn.query("SELECT * FROM kullanicilar WHERE kullanici_adi=?",
        [kullanici_adi], (error, results) => {
            if (results.length > 0) {
                const comparePassword = bcrypt.compare(sifre, results[0].sifre)
                if (comparePassword) {
                    return new Response(result).basarili_giris(res)
                } else {
                    return res.status(203).json({
                        success: false,
                        message: "Kullanıcı veya Şifre Uyumsuz"
                    })
                }
            } else {
                return res.status(203).json({
                    success: false,
                    message: "Kullanıcı Girişi Başarısız"
                })
            }
        })
}

const register = async (req, res) => {
    const kullanici_adi = req.body.kullanici_adi
    const sifre = await bcrypt.hash(req.body.sifre, 10)
    const eposta = req.body.eposta
    const adi = req.body.adi
    const soyadi = req.body.soyadi
    const tel_no = req.body.tel_no
    const cinsiyet = req.body.cinsiyet
    const dogum_tarihi = req.body.dogum_tarihi
    dbConn.query("select * from kullanicilar where kullanici_adi=?", kullanici_adi, (err, result) => {
        if (result.length > 0) {
            return new Response(result).duplicated(res)
        } else {
            dbConn.query("INSERT INTO kullanicilar (kullanici_adi,sifre,eposta,adi,soyadi,tel_no,cinsiyet,dogum_tarihi) VALUES (?,?,?,?,?,?,?,?)"
                , [kullanici_adi, sifre, eposta, adi, soyadi, tel_no, cinsiyet, dogum_tarihi], (err, result) => {
                    if (!err) {
                        return new Response(result).created(res)
                    } else {
                        console.log(err)
                    }


                })
        }
    })
}


const addKampanya = async (req, res) => {
    const { kampanya_adi, baslangic_tarihi, bitis_tarihi, kanal_id, bütce } = req.body;
    const query = "INSERT INTO kampanyalar (kampanya_adi, baslangic_tarihi, bitis_tarihi, kanal_id, bütce) VALUES (?, ?, ?, ?, ?)";

    dbConn.query(query, [kampanya_adi, baslangic_tarihi, bitis_tarihi, kanal_id, bütce], (err, result) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;
        }
        res.status(201).json(result);
    });
};



const getKampanyalar = (req, res) => {
    const query = 'SELECT kampanyalar.kampanya_adi,kampanyalar.baslangic_tarihi,kampanyalar.bitis_tarihi,kampanyalar.bütce FROM kampanyalar';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
};



const addOgrenci = async (req, res) => {
    const { ad, soyad, eposta, telefon, kanal_adi } = req.body;

    // İlk olarak kanal_id'yi bulun
    const kanalSorgusu = "SELECT kanal_id FROM kanallar WHERE kanal_adi = ?";
    dbConn.query(kanalSorgusu, [kanal_adi], (kanalErr, kanalSonucu) => {
        if (kanalErr) {
            console.error("Kanal Sorgusunda Hata:", kanalErr);
            res.status(500).send("Sunucu Hatası");
            return;
        }
        if (kanalSonucu.length > 0) {
            const kanal_id = kanalSonucu[0].kanal_id;

            // Şimdi öğrenciyi ekle
            const eklemeSorgusu = "INSERT INTO potansiyel_ogrenci (ad, soyad, eposta, telefon, kanal_id) VALUES (?, ?, ?, ?, ?)";
            dbConn.query(eklemeSorgusu, [ad, soyad, eposta, telefon, kanal_id], (eklemeErr, eklemeSonucu) => {
                if (eklemeErr) {
                    console.error("Öğrenci Ekleme Sorgusunda Hata:", eklemeErr);
                    res.status(500).send("Öğrenci Ekleme İşlemi Başarısız");
                    return;
                }
                // Burada yeni eklenen öğrencinin bilgilerini döndür
                res.status(201).json({
                    ad: ad,
                    soyad: soyad,
                    eposta: eposta,
                    telefon: telefon,
                    kanal_adi: kanal_adi
                });
            });
        } else {
            res.status(404).send("Belirtilen Kanal Adı Bulunamadı");
        }
    });
};




const getTotalBudget = async (req, res) => {
    const query = 'SELECT SUM(bütce) as totalBudget FROM kampanyalar';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

const getTotalSpend = async (req, res) => {
    const query = 'SELECT SUM(toplam_harcama) as totalSpend FROM kampanya_performans';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}


const getTotalBasvuru = async (req, res) => {
    const query = 'SELECT SUM(kampanya_performans.basvuru_sayisi) as totalBasvuru FROM kampanya_performans';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}

const getTotalKatilimci = async (req, res) => {
    const query = 'SELECT SUM(katilimci_sayisi) as totalKatilimci FROM etkinlikler';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}


const getTotalKayit = async (req, res) => {
    const query = 'SELECT SUM(kayit_sayisi) as totalKayit FROM kampanya_performans';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
}




const getEklenen = (req, res) => {
    const query = 'SELECT logs.description,logs.created_at FROM logs';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
};


const getNewKampanya = (req, res) => {
    const query = 'SELECT kampanya_logs.description,kampanya_logs.created_at FROM kampanya_logs';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
};

const etkinlik_getir = (req, res) => {
    const query = 'SELECT etkinlikler.etkinlik_adi FROM etkinlikler';
    dbConn.query(query, (err, results) => {
        if (err) {
            console.error("Sorguda Hata Oluştu:", err);
            res.status(500).send("Sunucu Hatası");
            return;

        }
        res.json(results);
    });
};

const getKampanyaByKanal = (req, res) => {

    const kanal_adi = req.query.kanal_adi;
    const query = `
    SELECT 
    kampanyalar.kampanya_adi, 
    kampanyalar.bütce, 
    SUM(etkinlikler.katilimci_sayisi) AS toplam_katilimci
FROM 
    kampanyalar 
INNER JOIN kanallar ON kampanyalar.kanal_id = kanallar.kanal_id
LEFT JOIN etkinlikler ON kampanyalar.kampanya_id = etkinlikler.kampanya_id
WHERE 
    kanallar.kanal_adi = ?
GROUP BY 
    kampanyalar.kampanya_adi, kampanyalar.bütce;
      `;

    dbConn.query(query, [kanal_adi], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Veritabanı sorgusunda bir hata oluştu.' });
        } else {
            res.json(results); // Sonuçları JSON formatında gönderin.
        }
    });
};


const kanalGraf = (req, res) => {
    const query = "SELECT kanallar.kanal_adi as ad, SUM(etkinlikler.katilimci_sayisi) AS toplam_katilimci_sayisi FROM kanallar JOIN etkinlikler ON kanallar.kanal_id = etkinlikler.kanal_id GROUP BY kanallar.kanal_adi"
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.ad);
        const data = results.map((row) => row.toplam_katilimci_sayisi);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Her Kanaldaki Katılımcı Sayısı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}


const butceGraf = (req, res) => {
    const query = "SELECT kampanyalar.kampanya_adi AS KampanyaAdı,kampanyalar.bütce AS Bütçe FROM Kampanyalar WHERE YEAR(kampanyalar.baslangic_tarihi) = 2023"
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.KampanyaAdı);
        const data = results.map((row) => row.Bütçe);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Her Kampanya İçin Ayrılan Bütçe",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}



const kampanyaGraf = (req, res) => {
    const query = "SELECT kampanyalar.kampanya_adi AS ad, kampanya_performans.basvuru_sayisi AS basvuru FROM kampanyalar,kampanya_performans WHERE kampanyalar.kampanya_id=kampanya_performans.kampanya_id GROUP BY ad,basvuru"
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.ad);
        const data = results.map((row) => row.basvuru);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Her Kampanya İçin Başvuru Sayısı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}



const etGraf = (req, res) => {
    const query = "SELECT etkinlikler.etkinlik_adi AS ad,etkinlikler.katilimci_sayisi AS katilimci FROM etkinlikler  GROUP BY ad"
    dbConn.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        const labels = results.map((row) => row.ad);
        const data = results.map((row) => row.katilimci);

        const responseData = {
            labels: labels,
            datasets: [{
                label: "Her Etkinlik İçin Katılımcı Sayısı",
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        }
        res.json(responseData)
    })
}


















module.exports = { etGraf, kampanyaGraf, butceGraf, kanalGraf, getKampanyaByKanal, login, register, getKampanyalar, addKampanya, addOgrenci, getTotalBudget, getTotalSpend, getEklenen, getNewKampanya, getTotalBasvuru, getTotalKatilimci, getTotalKayit, etkinlik_getir }




















