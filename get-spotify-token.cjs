const http = require('http');
const https = require('https');
const querystring = require('querystring');

// Kredensial yang kamu berikan
const CLIENT_ID = '3171552a7fa84266b4a46e05d8093a9d';
const CLIENT_SECRET = '06fb48aa338443fd993a3c68d102d87c';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';

const authUrl = `https://accounts.spotify.com/authorize?` + querystring.stringify({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: 'user-read-currently-playing user-read-recently-played',
  redirect_uri: REDIRECT_URI
});

console.log('====================================================');
console.log('LANGKAH 1: BUKA URL DI BAWAH INI DI BROWSER KAMU');
console.log('====================================================\n');
console.log(authUrl);
console.log('\n(Server berjalan di port 8888, menunggu login kamu dari browser...)');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/callback')) {
    const code = new URL(req.url, 'http://127.0.0.1:8888').searchParams.get('code');
    
    if (code) {
      const postData = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      });

      const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const tokenReq = https.request(options, (tokenRes) => {
        let body = '';
        tokenRes.on('data', (chunk) => body += chunk);
        tokenRes.on('end', () => {
          const data = JSON.parse(body);
          if (data.refresh_token) {
            console.log('\n✅ BERHASIL! INI REFRESH TOKEN KAMU:');
            console.log('====================================================');
            console.log(data.refresh_token);
            console.log('====================================================\n');
            console.log('Silakan copy Refresh Token di atas dan kembali ke chat AI. Script ini akan tertutup otomatis.');
            res.end('<h1>Berhasil! Silakan tutup tab ini dan lihat terminal Anda.</h1>');
          } else {
            console.log('Gagal mendapatkan refresh token:', data);
            res.end('Gagal. Cek terminal.');
          }
          process.exit(0);
        });
      });
      
      tokenReq.write(postData);
      tokenReq.end();
    }
  }
});

server.listen(8888, '127.0.0.1');
