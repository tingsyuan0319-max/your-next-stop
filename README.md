# 登機倒數：測一張暫停生活的單程機票 🗺️

以「出逃上班族」的視角，透過 8 道心境情境選擇，測出最契合的避世目的地，並生成專屬復古手繪登機證。

![Project Banner](banner.jpeg)

---

## ✨ 專案亮點

- 🎨 **奶油雜誌風（Cream Editorial）視覺**：典雅復古雜誌排版，全站搭載繁體中文圓潤字體。
- ✈️ **29 座避世目的地**：涵蓋中短程池（11城）與長程池（18城），每張機票皆為精緻裁切的手繪復古票券插畫。
- 🎵 **Web Audio API 鋼琴和弦 BGM**：原生合成 Lo-Fi 環境音樂，右上角黑膠唱片開關即點即播。
- 🔮 **靈魂盲選三選一**：最高分前三名目的地以「直覺金句」盲選，引導內心深處最真實的渴望。
- 📥 **9:16 高清圖卡匯出**：一鍵生成 IG 限時動態規格（1080×1920）專屬登機證圖片。

---

## 🚀 部署至 GitHub Pages 步驟

1. 在 GitHub 上建立一個新的 Repository（例如命名為 `travel-quiz` 或 `travelproject`）。
2. 在本地專案資料夾執行以下指令將程式碼推送到 GitHub：

```bash
git init
git add .
git commit -m "feat: initial commit for travel boarding pass quiz"
git branch -M main
git remote add origin https://github.com/<你的GitHub帳號>/<Repository名稱>.git
git push -u origin main
```

3. 到 GitHub 該專案頁面，點選 **Settings** > **Pages**：
   - **Branch**: 選擇 `main` / `root`
   - 點擊 **Save** 保存。
4. 稍等約 1 分鐘，GitHub 就會自動生成您的公開測驗網址：  
   `https://<你的GitHub帳號>.github.io/<Repository名稱>/`

---

## 🖼️ 社群分享縮圖（Open Graph）

已在 `index.html` 中配置好標準社群分享標籤（OG Meta Tags & Twitter Card），分享至 **LINE、Facebook、Threads、Instagram、Discord** 時將自動抓取 `banner.jpeg` 作為預覽縮圖。
