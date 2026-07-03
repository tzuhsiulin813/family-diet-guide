# 家庭健康飲食指南

媽媽的家庭飲食決策助理，用來依家庭成員資料、健康目標、過敏原、家中庫存與常用通路，規劃菜單、烹飪方法與採買清單。

## 使用方式

這是一個純靜態網站，不需要後端伺服器。直接部署 `index.html`、`styles.css`、`app.js` 即可。

本機預覽：

```bash
python3 -m http.server 8000
```

開啟：

```text
http://127.0.0.1:8000/
```

## 部署

適合部署到 GitHub Pages、Netlify、Vercel 或任何靜態網站主機。

GitHub Pages 建議設定：

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

## 資料安全

目前資料儲存在使用者裝置的瀏覽器 `localStorage`，不會上傳到伺服器，也不會跨手機、iPad、電腦自動同步。
