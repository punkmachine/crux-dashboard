# Crux Dashboard

Монорепозиторий для мониторинга метрик Chrome User Experience Report (CrUX).

## Требования

- Node.js >= 24.0.0
- pnpm >= 10.0.0
- PostgreSQL

## Быстрый старт

1. **Установка зависимостей:**

   ```bash
   pnpm install
   ```

2. **Настройка переменных окружения:**

   ```bash
   cd apps/backend
   cp .env.example .env
   ```

   Отредактируйте `.env` файл и укажите:
   - Данные для подключения к PostgreSQL
   - `CRUX_API_KEY` — ключ API от Google CrUX

3. **Запуск базы данных:**
   Убедитесь, что PostgreSQL запущен и создана база данных `crux_dashboard`.

4. **Запуск приложений:**

   Backend (в отдельном терминале):

   ```bash
   cd apps/backend
   pnpm dev
   ```

   Dashboard (в отдельном терминале):

   ```bash
   cd apps/dashboard
   pnpm dev
   ```

   Admin (опционально):

   ```bash
   cd apps/admin
   pnpm dev
   ```

## Переменные окружения

Основные переменные в `apps/backend/.env`:

- `DB_*` — настройки PostgreSQL
- `CRUX_API_KEY` — ключ API Google CrUX
- `PORT` — порт backend сервера (по умолчанию 3000)
- `CRON_SCHEDULE` — расписание обновления метрик (по умолчанию каждые 10 минут)
- `TYPEORM_SYNCHRONIZE` — автоматическая синхронизация схемы БД (true для dev)
