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

## 2026-05-15 生存報告合併 + 棲地分頁

**流程調整**
- 移除「先看一般報告再進反思」的中間步驟,點「展開行動」直接進入有 AI 對話的生存報告(原反思模式版面)。
- 一般模式的「開始反思 →」按鈕順勢退場,CTA 永遠是「結束反思」。

**版面**
- 報告固定為:左欄上下堆疊(族群變化 + 觸發事件) + 右欄 AI 對話。
- 左欄上方新增棲地分頁列,只列出玩家族群數 > 0 的棲地;點分頁切換左欄顯示。

**資料結構**
- `HD_REPORT` 改為 `{ round, totals, event, habitats: { [habitatId]: { beforeCount, afterCount, changes } } }`,棲地專屬的結算搬到 habitats[xxx]。
- `totals` 與 `event` 仍為全域共用(整回合的全族群統計 / 觸發事件)。

**檔案異動**
- `js/data.js`:`HD_REPORT` 改為 per-habitat 結構,補上 forest / urban / port 三個棲地的 mock。
- `js/state.js`:新增 `reportHabitatId`(null = 渲染時自動挑第一個玩家有族群的棲地)。
- `js/components/queue-panel.js`:展開行動時直接帶 `reflectionMode: true` + `reportHabitatId: null`。
- `js/components/survival-report.js`:整支重寫,移除一般模式分支,新增分頁列與切換邏輯。

