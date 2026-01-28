# CrUX Dashboard

Дашборд для визуализации данных Chrome User Experience Report (CrUX) API. Позволяет анализировать метрики производительности веб-сайтов на основе реальных данных пользователей Chrome.

## Установка

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd crux-dashboard
```

2. Установите зависимости:

```bash
pnpm install
```

3. Создайте файл `.env` в корне проекта:

```env
VITE_CRUX_API_KEY=your_api_key_here
```

## Получение API ключа

```env
VITE_CRUX_API_KEY=ваш_ключ_здесь
```

## Использование

### Разработка

Запустите dev-сервер:

```bash
pnpm dev
```

### Сборка

Создайте production сборку:

```bash
pnpm build
```

Собранные файлы будут в директории `dist/`

### Превью production сборки

```bash
pnpm preview
```

## Ссылки

- [CrUX API Documentation](https://developer.chrome.com/docs/crux/api)
- [Core Web Vitals](https://web.dev/articles/vitals)
