# 🚀 SMMZivo - Deployment Guide (مکمل گائیڈ)

Aap is application ko kisi bhi platform (Cloud Run, VPS / Ubuntu, Docker, Render, Railway) par easily deploy kar sakte hain.

---

## Method 1: Google Cloud Run / AI Studio (Direct 1-Click)
Agar aap Google AI Studio use kar rahe hain:
1. Top right menu mein **Deploy** ya **Share** par click karein.
2. **Deploy to Cloud Run** select karein.
3. Automatically build ho kar live URL mil jayega.

---

## Method 2: Docker & Docker Compose (Recommended for VPS / Server)

Agar aapke paas VPS (DigitalOcean, Contabo, Hetzner, AWS EC2 waghera) hai aur Docker installed hai:

### Step 1: Docker Compose se Run karein
```bash
# Container build aur start karein background mein:
docker compose up -d --build

# Logs check karne ke liye:
docker compose logs -f
```

Application `http://YOUR_SERVER_IP:3000` par live chalegi.

---

## Method 3: Ubuntu / Linux VPS (Node.js + PM2)

Aap bina Docker ke bhi direct Node.js aur PM2 se deploy kar sakte hain:

### 1. Node.js 20 install karein
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Dependencies install aur build karein
```bash
npm install
npm run build
```

### 3. PM2 Process Manager se start karein
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy (Domain & SSL ke liye)
`/etc/nginx/sites-available/smmzivo` create karein:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable karein aur Certbot se free SSL lagayein:
```bash
sudo ln -s /etc/nginx/sites-available/smmzivo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Method 4: Render / Railway
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Port:** `3000`

---

## 🔍 Verification Commands
Deploy hone ke baad check karne ke liye:
```bash
curl http://localhost:3000/api/user
```
Agar response mein user JSON mile to panel 100% active hai!
