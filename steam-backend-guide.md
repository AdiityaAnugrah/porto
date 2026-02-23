# Panduan Integrasi Backend Steam API

Untuk membuat komponen `SteamCard` berfungsi secara *real-time* tanpa terkena blokir CORS dari browser, Anda perlu membuat *endpoint* Node.js di server `beliakun.com` Anda.

Gunakan **Steam Web API Resmi** karena ini adalah cara yang paling tangguh (tidak bergantung pada _scraping_ web).

## 1. Persiapan Kredensial
1. Dapatkan **Steam API Key** gratis Anda di: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
2. Cari tau **Steam ID 64** Anda (angkanya panjang seperti `76561198xxx`). Anda bisa mengeceknya dari URL profil Anda atau menggunakan alat seperti `steamid.io`.
3. Masukkan keduanya ke file `.env` di backend Anda (`beliakun.com`):
   ```env
   STEAM_API_KEY=KODE_API_KEY_ANDA_DI_SINI
   STEAM_ID=76561198XXX_ID_ANDA_DI_SINI
   ```

## 2. Kode Referensi Endpoint (Node.js/Express)
Salin fungsi ini ke dalam backend Anda (file `server.js` atau _controller_ rute API Anda). Kode ini akan menarik data Anda dan menyederhanakannya menjadi format JSON yang siap dibaca oleh frontend `SteamCard.jsx`.

```javascript
const axios = require('axios'); // Pastikan sudah npm install axios

// --- ENDPOINT UNTUK STEAM PROFILE ---
app.get('/steam/profile', async (req, res) => {
    // Enable CORS agar bisa diambil oleh adityaanugrah.me
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    
    try {
        const STEAM_API_KEY = process.env.STEAM_API_KEY;
        const STEAM_ID = process.env.STEAM_ID;
        
        // Memanggil API Resmi Steam: GetPlayerSummaries
        const response = await axios.get(
            `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${STEAM_ID}`
        );
        
        // Mengambil profil Steam Anda (index 0)
        const player = response.data.response.players[0];
        if (!player) {
            return res.status(404).json({ error: "Steam Profile not found" });
        }

        // --- Membaca Status Online (personastate) ---
        // 0 = Offline, 1 = Online, 2 = Busy, 3 = Away, 4 = Snooze, 5 = looking to trade, 6 = looking to play
        let currentState = 'Offline';
        if (player.personastate > 0) currentState = 'Online';
        
        // --- Membaca Jika Sedang Bermain Game (gameextrainfo) ---
        // Jika sedang memutar game, variable ini akan terisi nama gamenya
        if (player.gameextrainfo) {
            currentState = 'In-Game';
        }

        // Membungkus data untuk dikirim ke frontend
        const steamData = {
            username: player.personaname, 
            state: currentState,          // 'Online', 'Offline', atau 'In-Game'
            avatarUrl: player.avatarfull, // HD Avatar
            gameName: player.gameextrainfo || null,
            gameId: player.gameid || null, 
            profileUrl: player.profileurl
        };

        return res.json(steamData);
        
    } catch (error) {
        console.error('Steam API Error:', error.message);
        
        // Berikan data fallback jika API Steam gagal agar frontend tidak hancur
        return res.status(500).json({ 
             error: "Gagal mengambil data Steam API.", 
             state: "Offline", 
             username: "Aditya"
        });
    }
});
```

## 3. Penjelasan Alur Sistem
1. Frontend (`SteamCard.jsx` di `porto`) akan melakukan fetch ke `https://api.beliakun.com/steam/profile`.
2. Backend Anda akan "diam-diam" menghubungi server utama Steam menggunakan *API Key* rahasia Anda.
3. Steam membalas dengan data mentah (_raw_).
4. Node.js akan mengolah data mentah tersebut, menerjemahkan kode angka `personastate === 1` menjadi status string **"Online"**, dan mengecek apakah Anda sedang bermain game.
5. Node.js membuang data yang tidak perlu, dan membalas `SteamCard.jsx` dengan data JSON yang rapi dan halus.

**Langkah Terakhir:**
Beri tahu saya jika Anda sudah selesai menaruh dan menyalakan kode backend ini di server `beliakun.com` Anda. Jika sudah menyala, saya akan langsung memasangkan tautan API-nya ke dalam UI `SteamCard.jsx` di proyek Porto ini!
