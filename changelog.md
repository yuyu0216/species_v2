# changelog

## 2026-05-12 行動階段大改:行動列下移 + 已選擇行動佇列

**行為調整**
- 地圖只顯示玩家自己族群的 pin,其他物種對學生隱藏。
- 左側性狀只列已解鎖,未解鎖性狀完全不揭露(僅在無解鎖時提示一行)。
- 右上角剩餘 AP 改為 `apTotal - sum(queued.cost)` 動態算出,加減行動立即同步。

**版面**
- 中欄底部的 AI 對話視窗移除(聊天功能僅保留在生存報告的反思模式)。
- 中欄底部改為水平排列的「行動選擇列」:4 張卡(覓食 / 繁殖 / 遷移 / 探索)。
- 右欄改為「已選擇行動」佇列,最多 10 格高度,超過捲動;每筆顯示「棲地-行動」例如「農田 · 覓食」「農田 → 森林」。

**互動規則**
- 覓食 / 繁殖 / 探索:點卡片直接加入佇列,綁定當前選中的棲地,可重複加。
- 遷移:卡本體不可點,內含 2 顆相鄰棲地的子按鈕(由 `HD_HABITATS[i].adjacent` 提供),點子按鈕才會加入佇列。
- 點佇列條目刪除該筆;AP 不足時行動卡會 dim 但仍能點佇列做減項。

**檔案異動**
- 新增 `js/components/queue-panel.js` 與 index.html 載入。
- `js/components/action-panel.js` 整段重寫,移除 toggle/queued 樣式與 banner。
- `js/components/action-screen.js` 三欄組合改成 sidepanel / map+actbar / queuepanel。
- `js/components/habitat-map.js`、`js/components/side-panel.js` 篩掉非自身物種與未解鎖性狀。
- `js/components/topbar.js` 動態算 apRemain。
- `js/state.js` 移除 `apRemain`,初始 `queued = []`。
- `js/data.js` 棲地補上 `shortName` 與 `adjacent`(邊相鄰)。
- `styles/action-screen.css` 三欄寬調整為 280 / 1fr / 300,新增 hd-actbar / hd-queue 樣式區塊。
