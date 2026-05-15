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
- `styles/report-screen.css`:`left-stack` 加一列 grid(放分頁);新增 `.hd-report-tabs / .hd-report-tab / .hd-changes-empty`。

## 2026-05-15 行動階段平板版 UI 套用(reference/ui-adjust.html)

**版面**
- 舞台從 1180×820 改為 1366×900,topbar 高度 100 → 72,字級全面調整(`base.css`、`topbar.css`、`main.js` 同步)。
- 行動階段從「3 欄(280/1fr/300)」改為「2 欄(1fr/380)」:
  - **左 .hd-main**:上方地圖(2×2)+ 下方底列三張卡(棲地詳情 / 族群分布+性狀 / AI 對話)
  - **右 .hd-side**:行動選擇 4 張卡(垂直堆疊)+ 已選擇佇列 + 展開行動
- 地圖 tile:左上角換成「你的族群:N」深色徽章(含玩家物種色點),右上角為棲地名稱白底膠囊;移除左下角的 `__own` 與舊 `__nametag`,地圖不再寫死 320px 高,改由 `.hd-main` 撐高。
- AI 對話沿用既有 `hd-chat` 元件版型(header / scrollable body / textarea form),只是放到底列第三張卡的位置;沒有改成 reference 的 avatar+bubble 簡化版。

**檔案異動**
- `js/main.js`:`fitStage` 改用 1366×900。
- `js/components/action-screen.js`:整支改寫,變成 `main(map + botrow)` + `side(actbar + queue)`。
- `js/components/side-panel.js`:整支改寫,移除舊的 `hdRenderSidePanel`,改為兩個函式 `hdRenderHabitatDetail` / `hdRenderPopAndTraits`,給底列分別用。
- `js/components/habitat-map.js`:tile 多加 `__badge`(你的族群)與 `__name`(棲地名稱)兩個 overlay。
- `styles/base.css`:`--hd-stage-w/h`、`--hd-topbar-h`、base font-size、`.hd-pill` 尺寸放大。
- `styles/topbar.css`:logo / 標題 / 環形 AP 尺寸調整。
- `styles/action-screen.css`:整支改寫,新增 `.hd-main / .hd-botrow / .hd-card / .hd-detail / .hd-section-title / .hd-traits__divider`,行動卡與佇列同步放大。
- `styles/habitat-map.css`:移除 `__nametag / __own`,新增 `__name / __badge`,移除固定 320px 高。
- `index.html`:`<meta viewport content="width=1366">`。

**保留原狀**
- AI 對話的 DOM/CSS 結構(`chat.js` / `chat.css`)。
- state schema、行動規則、queue 操作邏輯、登入流程、生存報告版面(只在第 7 頁:行動階段做版面調整)。

## 2026-05-15 全畫面字級放大 ~50%(iPad 易讀,無 tiny words)

**設計目標**
- 所有可讀文字最小 14px(原本許多 10-12px 的標籤、提示、數字小字全升上去),iPad 上學生不需瞇眼。
- 主要文字、數字、按鈕字級 ×1.5;頂部 topbar、底列卡片內元素同步放大;為了不爆版,padding / gap / icon 容器同步微調。
- 舞台仍維持 1366×900,由 `main.js` 的 fitStage 縮放到 iPad 視窗。

**主要尺寸對照**
- TopBar 高度 72 → 92;Logo / Title 26 → 32;倒數 pill 字級從 16 跳到 22(value),label 13 → 17;AP 環 ring 48 → 60,中心數字 22 → 28。
- 行動卡:卡名 19 → 24,敘述 13 → 16,AP 數字 22 → 28;icon 容器 40 → 46,SVG 18 → 24。
- 已選擇佇列:項目高度 44 → 52,文字 16 → 20,索引/AP/× 全部放大。
- 「展開行動」按鈕字級 22 → 27;.hd-side 寬度 380 → 420 以容納大字。
- 棲地詳情卡:名稱 24 → 28,資源 label 15 → 19,百分比 21 → 26;資源條高 8 → 10。
- 族群分布列字級 14 → 18,數字 15 → 19;性狀膠囊 13 → 17;dot 8 → 10。
- 地圖 tile:badge / name 16 → 22,padding 與圓角放大。
- AI 對話:bubble 15 → 20,輸入框 15 → 19,標題 16 → 22。
- 生存報告:回合數 42 → 54(反思模式),統計卡 lbl 10 → 14、val 20 → 26;變化 row name 15 → 20、detail 11 → 15;事件 title 16 → 21、quote 13 → 17;CTA 文字 15 → 19。
- 登入卡寬 520 → 620,標題 30 → 38,輸入框字級 18 → 23,送出按鈕 22 → 28。
- body 基礎字級 16 → 22(雖然多數元件用顯式 px,但 input / select / 部分繼承會跟著放大)。

**檔案異動**
- 全部 `styles/*.css` 改字級。
- `js/icons.js`:`hdRoundGaugeSvg` 的 SVG 外框 48 → 60(viewBox 不變)。
- `js/components/{topbar,chat,action-panel,side-panel,survival-report}.js`:`hdIconSvg(..., N)` 第二參數調整,inline `<small style="font-size:11px">` 改 14px。
- 沒有移動 DOM / 邏輯,只有尺寸與容器調整。

**沒爆版的關鍵調整**
- `.hd-main` 上下比 1.65fr/1fr 改 1.45fr/1fr,讓底列三張卡有更多縱向空間放大字。
- `.hd-card` 加 `overflow: hidden` 避免文字大到撐破。
- 部分 padding / gap 收緊(底列卡 padding 16 18 → 14 16,actbar gap 8 → 7),用內距空間換字級空間。

## 2026-05-15 字級回到原始尺寸 + 最低 13px 規則 + 防止溢出捲動

**作法**
- 撤掉前兩輪的整體放大(×1.5 → ×1.15),所有字級、padding、icon、容器尺寸回到行動階段平板版剛建好的原始基準。
- 唯一的全域規則:把先前 10–12px 的小字統一拉到 **13px**(包括 topbar subtitle / mock / meta、生存報告反思模式裡的 stat-card__lbl、kicker、change__detail、event__badge、event-effect 等)。
- 12px 大小的圖示與徽章內部小元件(像 event-effect__dot、popmini 12px 欄寬)保留不動。

**防止內容外溢觸發捲動**
- `.hd-shell` 加 `overflow: hidden`(原本只有 body / stage 有)。
- `.hd-report` 加 `overflow: hidden`。
- `.hd-main`、`.hd-botrow` 補上 `min-width: 0`(grid 子項在 1fr 縮放時不會被 children intrinsic size 撐爆)。
- `.hd-card` 已有 `overflow: hidden`,保留;這樣子 grid 子卡內容變動時,溢出會被裁切而不是去撐破舞台/觸發 scroll。
- 內部刻意的 `overflow-y: auto`(queue list / chat body / event-effects / report-changes)保留 — 那些是設計上允許局部捲動的區塊。

**檔案異動**
- 全部 `styles/*.css` 字級回原始 + 小字 floor 13px。
- `js/icons.js`:gauge SVG 54 → 48 回到原始。
- `js/components/{topbar,chat,action-panel,side-panel,survival-report}.js`:`hdIconSvg(..., N)` 全部回到原本的參數。

## 2026-05-15 底列重組:族群分佈搬進左卡 + 新增「我的狀態」卡

**行為**
- 族群分佈從中間卡移動到「棲地詳情」卡內(資源條下方),改成 2 欄排版,自動依數量降冪;**過濾掉 0 隻的物種**,且**不再標註「· 你」**(因為遊戲中可能會有其他藍色玩家,用顯眼標記不再合理)。
- 中間卡改為「我的狀態」:顯示我在此棲地的數量、糧食、適應程度;下方保留已解鎖性狀。
- 三張底列卡:左 1.2fr(資源 + 族群分佈)/ 中 0.9fr(我的狀態)/ 右 1.5fr(AI 對話),互不覆蓋。

**新資料**
- `state.playerFood`(mock = 2)、`state.playerAdaptation`(mock = "良好")。
- `HD_PLAYER_DEFAULT` 也補上 `food / adaptation` 兩個欄位作為備援。
- 未來接 GAS 後由後端推這兩個欄位的真實值。

**檔案異動**
- `js/state.js`:新增 `playerFood`、`playerAdaptation`。
- `js/data.js`:`HD_PLAYER_DEFAULT` 加 `food / adaptation`。
- `js/components/side-panel.js`:整支改寫。`hdRenderHabitatDetail` 卡內補族群分佈 2 欄;移除 `hdRenderPopAndTraits`,改成 `hdRenderMyStatus`(數量/糧食/適應 + 性狀)。
- `js/components/action-screen.js`:呼叫 `hdRenderMyStatus` 取代 `hdRenderPopAndTraits`。
- `styles/action-screen.css`:
  - `.hd-main` rows 1.65fr/1fr → 1.4fr/1fr,給底列更多縱向空間。
  - `.hd-botrow` 欄寬 1.05/1/1.5fr → 1.2/0.9/1.5fr。
  - `.hd-card` padding 16 18 → 14 16,gap 12 → 10,讓內容更緊。
  - 新增 `.hd-popmini__rows--2col`(grid 2 欄)與 `.hd-popmini`(在左卡內當子段落,上方有 dashed 分隔線)。
  - 新增 `.hd-mystatus / .hd-mystatus__rows / .hd-mystatus__row / .hd-mystatus__lbl / .hd-mystatus__val / .hd-mystatus__val--text`。
  - 移除 `.hd-popmini__row--self` 與 `.hd-popmini__name--self` 的「· 你」高亮樣式。
- `docs/structure.md`:畫面組合圖、render 函式表、state schema 同步更新。

## 2026-05-15 底列縮排細修(族群第三排不溢出 + 性狀可容納 6 個)

**問題**
- 左卡:資源條到族群分佈間距太寬,族群分佈第三排會被切掉。
- 中卡(我的狀態):狀態列佔太多縱向,下方性狀列表只能放 2-3 個。

**調整**
- `.hd-card` padding 14 16 → 12 14;gap 10 → 8。
- 資源條:`.hd-resources` gap 8 → 5;`.hd-resource` gap 4 → 3;bar 8 → 6px;label 15 → 14px;pct 21 → 19px;icon 22 → 20px。
- 棲地詳情標題列:icon 44 → 38;name 24 → 21;capacity 14 → 13。
- 族群分佈:padding-top 8 → 6;rows 2 col row-gap 2 → 1;row padding 3 → 2;dot 12 → 10;name 14 → 13;num 15 → 14;title 15 → 14。
- 我的狀態:rows gap 6 → 2;row padding 8 4 → 5 2;val 28 → 22;val--text 22 → 17;lbl 18 → 15。
- 性狀:divider padding-top 10 → 7;section-label margin-bottom 8 → 5;list gap 8 → 5;pill padding 6 12 6 10 → 4 10 4 8;gap 6 → 5;dot 8 → 7。
- `HD_TRAITS.unlocked` 從 2 → 6 個 mock 性狀(雜食性 / 群居 / 長距離遷徙 / 耐熱),驗證 6 個能在 2-3 排內擺好。

## 2026-05-15 生存報告改版:三區式版面 + 偵查報告區

**新版面**
- 整個 `.hd-report` 改為 `grid-template-columns: 3fr 2fr`(左 3/5 / 右 2/5),AI 對話從 1/2 縮到 2/5。
- 左 3/5 區分上下兩排:
  - **上排**:族群變化(+ 棲地分頁)| 觸發事件
  - **下排**:偵查報告紀錄(列表)| 新偵查報告(內容 + 解鎖性狀)
- 右 2/5 區:AI 對話縱向貫穿 row 2(從 head 下方到 CTA 上方)。

**新元件**
- `.hd-recon-list` / `.hd-recon-list__item / __id / __lbl / __round` — 左下偵查報告列表;active 用 accent 橘色高亮。
- `.hd-recon-detail` / `__head / __id / __title / __round / __body / __line / __foot / __foot-lbl / __foot-val` — 右下偵查報告內容卡;有解鎖性狀時 val 用 success 綠,無則 ink-muted。

**新資料**
- `HD_REPORT_LOGS`(data.js)— 6 筆偵查報告 mock,各帶 id / round / title / content / unlocked。
- `state.selectedReportLogId`(初值 null;渲染時自動選最新一筆;點列表切換)。

**檔案異動**
- `js/state.js`:新增 `selectedReportLogId`。
- `js/data.js`:新增 `HD_REPORT_LOGS`。
- `js/components/survival-report.js`:整支改寫成三區式版面;`hdRenderReport` 內新增 `renderReconList` / `renderReconDetail`;結束反思時一併重置 `selectedReportLogId`。
- `styles/report-screen.css`:整支改寫;新增 `.hd-report__main / __top / __bot / __chat / __changes-wrap` grid 骨架,以及 `.hd-recon-list*` / `.hd-recon-detail*` 樣式;移除舊的左欄 `__left-stack`(已被新的 main + 縱向 chat 取代)。





**原因**
- 前一輪 ×1.5 的字級在 iPad 視覺上太大,擠版面、看起來笨重。
- 改成 ×1.15(以平板版 1366×900 的原始尺寸為基準),維持可讀但不誇張。

**主要對照(平板版基準 → 現行)**
- 舞台 topbar 92 → 82;body 22 → 18。
- TopBar:logo 60 → 56、title 32 → 30、subtitle 15 → 13;timer min-width 72 → 64;AP 環 60 → 54、中心數字 28 → 25。
- 行動卡:icon 容器 46 → 44,名稱 24 → 22,敘述 16 → 15,AP 28 → 25。
- 已選擇佇列:項目高 52 → 48、文字 20 → 18;「展開行動」27 → 25。
- 棲地詳情:名稱 28 → 27,資源 label 19 → 17,百分比 26 → 24。
- 族群分布列 18 → 16,數字 19 → 17;性狀 17 → 15。
- 地圖 tile:badge / name 22 → 18。
- AI 對話:bubble 20 → 17,輸入框 19 → 17。
- 生存報告(反思模式):回合數 54 → 48、變化 name 20 → 17、事件 title 21 → 18。
- 登入卡:寬 620 → 580、標題 38 → 35、輸入框 23 → 21、送出 28 → 25。
- 右側欄寬 420 → 400;`.hd-main` 上下比 1.45fr/1fr 回到 1.6fr/1fr;`.hd-card` padding 14 16 → 15 17。

**檔案異動**
- 全部 `styles/*.css` 字級下調。
- `js/icons.js`:gauge SVG 60 → 54。
- `js/components/{topbar,chat,action-panel,side-panel,survival-report}.js`:`hdIconSvg` 第二參數同步下調,inline `font-size:14px → 13px`。




