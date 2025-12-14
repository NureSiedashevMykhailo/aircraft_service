# Быстрый старт

## Пошаговая инструкция для запуска проекта

### 1. Установите зависимости
```bash
npm install
```

### 2. Настройте базу данных PostgreSQL

**Создайте базу данных:**
```sql
CREATE DATABASE aircraft_monitoring;
```

**Создайте файл `.env`:**
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

**Отредактируйте `.env` файл:**
Откройте `.env` и замените данные подключения:
```env
DATABASE_URL="postgresql://ВАШ_ПОЛЬЗОВАТЕЛЬ:ВАШ_ПАРОЛЬ@localhost:5432/aircraft_monitoring?schema=public"
```

### 3. Примените схему базы данных
```bash
npm run db:push
```

### 4. Сгенерируйте Prisma Client
```bash
npm run db:generate
```

### 5. Запустите сервер
```bash
npm run dev
```

## Проверка работы

После запуска сервер будет доступен по адресу: **http://localhost:3000/api**

Проверьте работу API:
```bash
# Получить информацию о самолете (если есть данные)
curl http://localhost:3000/api/aircrafts/1

# Или откройте в браузере
http://localhost:3000/api/aircrafts/1
```

## Полезные команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск production версии
- `npm run db:studio` - открыть Prisma Studio (GUI для БД)
- `npm run db:migrate` - создать миграцию

## Решение проблем

**Ошибка подключения к БД:**
- Проверьте, что PostgreSQL запущен
- Проверьте правильность данных в `.env`
- Убедитесь, что база данных создана

**Ошибка "Prisma Client not generated":**
- Выполните `npm run db:generate`

**Порт 3000 занят:**
- Измените `PORT` в `.env` файле
- Или убейте процесс, использующий порт 3000

