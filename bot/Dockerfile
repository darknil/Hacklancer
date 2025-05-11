# Используем официальную минимальную версию образа Node.js
FROM node:24-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код в контейнер
COPY . .

# Компилируем TypeScript (если нужно)
RUN npm run build

# Запускаем приложение
CMD ["node", "dist/bot.js"]

# Открываем порты (если нужно, например, для бота)
EXPOSE 3000