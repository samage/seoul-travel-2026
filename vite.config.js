import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// 這是 Vite 的設定檔，我們加入了 PWA 套件設定
// 這樣做可以讓瀏覽器識別這是一個可安裝的應用程式

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // 當有新版本時自動更新
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '首爾自由行 2026', // 安裝後顯示的全名
        short_name: '首爾2026', // 手機桌面顯示的短名
        description: '首爾自由行 7天6夜行程助手',
        theme_color: '#ffffff', // 狀態列顏色
        background_color: '#ffffff',
        display: 'standalone', // 讓它看起來像原生 App (沒有網址列)
        orientation: 'portrait', // 鎖定直向 (手機優先)
        icons: [
          {
            src: 'pwa-192x192.png', // 注意：部署時您需要準備這些圖示放進 public 資料夾
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})