# Метрики CrUX API

Краткая сводка метрик, предоставляемых Chrome User Experience Report (CrUX) API.

## Сводка по отображению метрик в дашборде

### Core Web Vitals

- ✅ `largest_contentful_paint` (LCP)
- ✅ `interaction_to_next_paint` (INP)
- ✅ `cumulative_layout_shift` (CLS)

### Дополнительные метрики производительности

- ✅ `first_contentful_paint` (FCP)
- ✅ `experimental_time_to_first_byte` (TTFB)
- ✅ `round_trip_time` (RTT)

### Метрики LCP (детализация)

- ❌ `largest_contentful_paint_resource_type`
- ❌ `largest_contentful_paint_image_time_to_first_byte`
- ❌ `largest_contentful_paint_image_resource_load_delay`
- ❌ `largest_contentful_paint_image_resource_load_duration`
- ❌ `largest_contentful_paint_image_element_render_delay`

### Дополнительная информация

- ❌ `navigation_types`
- ❌ `form_factors`

---

## Core Web Vitals

### LCP (Largest Contentful Paint) — `largest_contentful_paint`

**Единица:** миллисекунды (ms)

Время загрузки самого большого контентного элемента на странице (изображение, текст, видео). Показывает, как быстро пользователь видит основной контент.

**Пороги:**

- ✅ Хорошо: ≤ 2500 мс
- ⚠️ Требует улучшения: 2500–4000 мс
- ❌ Плохо: > 4000 мс

---

### INP (Interaction to Next Paint) — `interaction_to_next_paint`

**Единица:** миллисекунды (ms)

Время от взаимодействия пользователя (клик, нажатие клавиши) до отрисовки следующего кадра. Отражает отзывчивость интерфейса.

**Пороги:**

- ✅ Хорошо: ≤ 200 мс
- ⚠️ Требует улучшения: 200–500 мс
- ❌ Плохо: > 500 мс

---

### CLS (Cumulative Layout Shift) — `cumulative_layout_shift`

**Единица:** без единиц (score)

Мера визуальной стабильности страницы. Показывает, насколько элементы страницы смещаются во время загрузки.

**Пороги:**

- ✅ Хорошо: ≤ 0.1
- ⚠️ Требует улучшения: 0.1–0.25
- ❌ Плохо: > 0.25

---

## Дополнительные метрики производительности

### FCP (First Contentful Paint) — `first_contentful_paint`

**Единица:** миллисекунды (ms)

Время до появления первого контента на экране (текст, изображение, SVG). Показывает скорость начала отрисовки.

**Пороги:**

- ✅ Хорошо: ≤ 1800 мс
- ⚠️ Требует улучшения: 1800–3000 мс
- ❌ Плохо: > 3000 мс

---

### TTFB (Time to First Byte) — `experimental_time_to_first_byte`

**Единица:** миллисекунды (ms)

Время от запроса страницы до получения первого байта ответа от сервера. Отражает скорость сервера и сетевую задержку.

**Пороги:**

- ✅ Хорошо: ≤ 800 мс
- ⚠️ Требует улучшения: 800–1800 мс
- ❌ Плохо: > 1800 мс

---

### RTT (Round Trip Time) — `round_trip_time`

**Единица:** миллисекунды (ms)

Время прохождения сигнала от клиента до сервера и обратно. Показывает сетевую задержку.

---

## Метрики LCP (детализация)

### LCP Resource Type — `largest_contentful_paint_resource_type`

**Единица:** проценты (%)

Распределение типов ресурсов, которые становятся LCP-элементом (image, text, video и т.д.).

---

### LCP Image TTFB — `largest_contentful_paint_image_time_to_first_byte`

**Единица:** миллисекунды (ms)

Время до получения первого байта изображения, которое является LCP-элементом.

---

### LCP Image Load Delay — `largest_contentful_paint_image_resource_load_delay`

**Единица:** миллисекунды (ms)

Задержка между обнаружением LCP-изображения и началом его загрузки.

---

### LCP Image Load Duration — `largest_contentful_paint_image_resource_load_duration`

**Единица:** миллисекунды (ms)

Время загрузки LCP-изображения от начала до завершения.

---

### LCP Image Render Delay — `largest_contentful_paint_image_element_render_delay`

**Единица:** миллисекунды (ms)

Задержка между завершением загрузки LCP-изображения и его отрисовкой на экране.

---

## Дополнительная информация

### Navigation Types — `navigation_types`

**Единица:** проценты (%)

Распределение типов навигации: `navigate` (переход по ссылке), `reload` (перезагрузка), `back_forward` (назад/вперёд), `prerender` (предзагрузка).

---

### Form Factors — `form_factors`

**Единица:** проценты (%)

Распределение трафика по типам устройств: `phone`, `tablet`, `desktop`.

---

## Формат данных

Метрики возвращаются в виде:

- **Histogram** — распределение значений с процентилями (p75)
- **Percentiles** — процентильные значения (обычно p75)
- **Fractions** — доли/проценты для категориальных метрик

---

## Полезные ссылки

- [CrUX API Documentation](https://developer.chrome.com/docs/crux/api/)
- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/vitals/core-web-vitals/)
