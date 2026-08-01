# urmărește.online — Faza 0

Director de meseriași pentru București + Ilfov. Stack: React/Vite + Node/Express + PostgreSQL.

## Structură

```
backend/     API Express (categorii, sectoare, business, leads) + schema.sql
frontend/    React/Vite — Home, /categorie/sector, profil, formular listare
```

## 1. Setup local (dezvoltare)

```bash
# baza de date
sudo -u postgres createuser urmareste_user -P
sudo -u postgres createdb urmareste -O urmareste_user
psql -U urmareste_user -d urmareste -f backend/schema.sql

# backend
cd backend
cp .env.example .env    # editează DATABASE_URL cu parola reală
npm install
npm run dev              # http://localhost:4000

# frontend (alt terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173, proxy /api -> :4000
```

## 2. Deploy pe VPS (Ubuntu, PM2 + Nginx — ca restul proiectelor tale)

```bash
# pe server, in /var/www/urmareste-online (sau unde tii proiectele)
git clone <repo> urmareste-online
cd urmareste-online

# DB
sudo -u postgres createuser urmareste_user -P
sudo -u postgres createdb urmareste -O urmareste_user
psql -U urmareste_user -d urmareste -f backend/schema.sql

# backend
cd backend && npm install --production
cp .env.example .env   # seteaza DATABASE_URL + PORT

# build frontend (backend serveste dist/ automat)
cd ../frontend && npm install && npm run build

# pornire cu PM2
cd ../backend
pm2 start src/server.js --name urmareste-backend
pm2 save
```

### Nginx (reverse proxy către portul backend-ului, ex 4000)

```nginx
server {
    listen 80;
    server_name urmareste.online www.urmareste.online;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Apoi `certbot --nginx -d urmareste.online -d www.urmareste.online` pentru SSL.

## 3. Ce urmează (Faza 1)

- Panou admin simplu pentru aprobarea profilurilor noi (`business.activ`) — nu există încă, momentan toate se salvează direct; adaugă un flag de moderare înainte de lansare publică.
- Upload poze (`business_photo`) — endpoint-ul nu e implementat încă, momentan doar schema există.
- Populare manuală: minim 8-10 profiluri per categorie caldă în Sector 1-3 și 6.

## Note tehnice

- Paginile `/categorie/sector` sunt randate client-side (SPA). Pentru indexare optimă Google, ia în calcul `vite-react-ssg` sau pre-render la build — momentan lipsă, dar structura de rute e deja pregătită pentru asta.
- Autorizația (`autorizatie_scan_url`) nu e niciodată expusă în răspunsul public al API-ului.
