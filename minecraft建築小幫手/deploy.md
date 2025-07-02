# 部署到GitHub Pages

## 步驟1: 創建GitHub倉庫

1. 前往 [GitHub.com](https://github.com) 並登入您的帳戶
2. 點擊右上角的 "+" 號，選擇 "New repository"
3. 倉庫名稱建議: `minecraft-building-helper`
4. 描述: `Minecraft建築小幫手 - 計算建築所需方塊數量`
5. 選擇 "Public" (公開)
6. 不要勾選 "Add a README file" (我們已經有了)
7. 點擊 "Create repository"

## 步驟2: 上傳代碼到GitHub

在您的本地目錄中執行以下命令：

```bash
# 添加遠程倉庫 (請將 YOUR_USERNAME 替換為您的GitHub用戶名)
git remote add origin https://github.com/YOUR_USERNAME/minecraft-building-helper.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

## 步驟3: 啟用GitHub Pages

1. 在GitHub倉庫頁面，點擊 "Settings" 標籤
2. 在左側菜單中找到 "Pages"
3. 在 "Source" 部分，選擇 "Deploy from a branch"
4. 在 "Branch" 下拉選單中選擇 "main"
5. 點擊 "Save"

## 步驟4: 訪問您的網站

幾分鐘後，您的網站將在以下網址可用：
```
https://YOUR_USERNAME.github.io/minecraft-building-helper
```

## 替代方案: 使用Netlify

如果您想要更快的部署，也可以使用Netlify：

1. 前往 [Netlify.com](https://netlify.com)
2. 註冊/登入帳戶
3. 點擊 "New site from Git"
4. 選擇 GitHub
5. 選擇您的倉庫
6. 點擊 "Deploy site"

您的網站將獲得一個隨機的Netlify網址，您也可以設置自定義域名。

## 替代方案: 使用Vercel

另一個快速部署選項：

1. 前往 [Vercel.com](https://vercel.com)
2. 註冊/登入帳戶
3. 點擊 "New Project"
4. 導入您的GitHub倉庫
5. 點擊 "Deploy"

## 文件結構

確保您的項目包含以下文件：
```
minecraft-building-helper/
├── index.html          # 主頁面
├── styles.css          # 樣式文件
├── script.js           # JavaScript功能
├── README.md           # 說明文件
└── deploy.md           # 部署說明
```

## 注意事項

- GitHub Pages 可能需要幾分鐘時間來部署您的網站
- 確保所有文件都已正確上傳到GitHub
- 如果遇到問題，檢查瀏覽器的開發者工具中的錯誤信息

## 自定義域名 (可選)

如果您有自己的域名，可以在GitHub Pages設置中添加自定義域名：

1. 在GitHub倉庫的Settings > Pages中
2. 在 "Custom domain" 欄位輸入您的域名
3. 保存設置
4. 在您的域名提供商處設置DNS記錄

---

部署完成後，您就可以通過網址分享您的Minecraft建築小幫手了！🎉 