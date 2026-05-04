const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./database');
const botManager = require('./bot-manager');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({ secret: 'steam-gizli-anahtar', resave: false, saveUninitialized: true }));

// Kayıt Ol
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.users.insert({ username, password, steamAccounts: [] }, (err, doc) => {
        if (err) return res.status(500).send("Hata!");
        res.json({ success: true });
    });
});

// Giriş Yap
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.users.findOne({ username, password }, (err, user) => {
        if (!user) return res.status(401).send("Hatalı giriş!");
        req.session.userId = user._id;
        res.json({ success: true });
    });
});

// Steam Hesabı Ekle ve Boost Başlat
app.post('/api/add-steam', (req, res) => {
    if (!req.session.userId) return res.status(401).send("Yetkisiz!");
    const { steamUser, steamPass, games } = req.body;
    
    const account = { steamUser, steamPass, games: games.split(','), active: true };
    botManager.startBoost(account);
    
    db.users.update({ _id: req.session.userId }, { $push: { steamAccounts: account } }, {}, () => {
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));