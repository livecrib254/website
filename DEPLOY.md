# Deploying to a VPS

The site is static (`dist/`) plus one dynamic route, `POST /api/contact`, which sends mail via
Postmark. On a VPS you need a **running Node process** for that route — Nginx alone serves static
files and will answer `405` to a `POST`, which is the error you saw.

Recommended setup: **Nginx serves the static build and reverse-proxies `/api/` to a Node service.**

## 1. Build on the server (or build locally and upload `dist/`)

```bash
git pull
npm install
npm run build          # outputs ./dist
```

## 2. Configure environment

Create `/var/www/livecrib/.env` (read by the Node service via dotenv):

```ini
PORT=8080
POSTMARK_SERVER_TOKEN=your-real-postmark-server-token
CONTACT_TO_EMAIL=info@livecrib.pro
CONTACT_FROM_EMAIL=info@livecrib.pro   # must be a verified Postmark sender/domain
```

## 3. Run the Node service (systemd)

`/etc/systemd/system/livecrib.service`:

```ini
[Unit]
Description=LiveCrib Node server
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/livecrib
ExecStart=/usr/bin/node server/prod.js
Restart=always
User=www-data
# .env in WorkingDirectory is loaded by dotenv; or use:
# EnvironmentFile=/var/www/livecrib/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now livecrib
sudo systemctl status livecrib        # confirm it's listening on :8080
```

(Or with pm2: `pm2 start server/prod.js --name livecrib && pm2 save`.)

## 4. Nginx: serve static, proxy the API

In your existing `server { … }` block for `livecrib.pro` (the HTTPS one):

```nginx
server {
    listen 443 ssl;
    server_name livecrib.pro www.livecrib.pro;
    # ... your existing ssl_certificate lines ...

    root /var/www/livecrib/dist;
    index index.html;

    # Send API calls to the Node service
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets + SPA fallback (client-side routing)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Now `POST https://www.livecrib.pro/api/contact` reaches Node → Postmark, and the 405 is gone.

## Alternative: let Node serve everything

`server/prod.js` also serves the static `dist/` and the SPA fallback, so you can skip Nginx static
config and just proxy **all** traffic to `127.0.0.1:8080` (`location / { proxy_pass ...; }`). The
config above (Nginx serves static, proxies only `/api/`) is a bit faster and is the recommended path.

## Redeploys

```bash
git pull && npm install && npm run build
sudo systemctl restart livecrib      # only needed if server/ or deps changed
```

Static-only changes just need `npm run build` (Nginx serves the new `dist/` immediately).
