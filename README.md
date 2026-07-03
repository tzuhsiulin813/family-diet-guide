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

目前家庭成員、偏好設定、庫存、飲食日誌與貼回的 AI 建議都儲存在使用者裝置的瀏覽器 `localStorage`，不會自動上傳到伺服器，也不會跨手機、iPad、電腦或不同使用者自動同步。

「複製給 ChatGPT」只會把 prompt 放進剪貼簿；「匯出 JSON」只會在本機下載檔案。只有使用者手動貼到 ChatGPT、手動上傳 JSON 或手動分享檔案時，資料才會離開裝置。

## 免責聲明

本工具僅供家庭飲食規劃參考，不作為醫療、營養治療或診斷依據。孕期、慢性病、特殊飲食需求或醫囑限制者，請諮詢專業醫師或營養師。
