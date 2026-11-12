# VTM6E API — better-sqlite3

## Установка на VDS

```bash
sudo mkdir -p /opt/vtm6e/server
sudo chown -R $USER:$USER /opt/vtm6e

# Скопировать файлы server/* → /opt/vtm6e/server/
cd /opt/vtm6e/server
npm ci --omit=dev          # или npm install для первого раза
cp .env.example .env       # отредактировать JWT_SECRET, INVITE_CODE
```

## Настройка nginx

Пример конфига `/etc/nginx/sites-available/vtm6e`:

```nginx
server {
    listen 443 ssl http2;
    server_name oxathiole.vampi.info;

    # --- Статика фронтенда ---
    location /vtm6elist/ {
        alias /var/www/vtm6elist/;
        try_files $uri $uri/ /vtm6elist/index.html;
    }

    # --- API ---
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Локальный запуск

```bash
cd server
npm install
cp .env.example .env
# отредактировать .env
npm run dev
```

## API Endpoints

| Метод | Путь | Auth | Описание |
|-------|------|------|----------|
| POST | `/api/register` | — | Регистрация (username, password, inviteCode) |
| POST | `/api/login` | — | Логин (username, password) |
| POST | `/api/verify-code` | — | Проверка invite code |
| GET | `/api/characters` | JWT | Получить персонажи пользователя |
| POST | `/api/characters` | JWT | Сохранить/обновить персонажи (upsert) |
| DELETE | `/api/characters/:id` | JWT | Удалить персонажа |
| GET | `/api/health` | — | Health check |
