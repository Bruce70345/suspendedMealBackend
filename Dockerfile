# 使用 Node.js 官方映像檔作為基底
FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製其餘檔案
COPY . .

# 開放 5000 埠
EXPOSE 5000

# 啟動應用程式
CMD ["npm", "start"]