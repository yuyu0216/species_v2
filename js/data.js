// data.js — 假資料(對應未來 API)
// 對應後端 endpoint(暫定):
//   GET  /api/game/state?player_id=...
//   GET  /api/habitats
//   GET  /api/reports/:round/:player_id
//   POST /api/actions

window.HD_SPECIES = [
  { id: "red",    name: "紅色族群", color: "var(--hd-species-red)",    hex: "#C8553D" },
  { id: "green",  name: "綠色族群", color: "var(--hd-species-green)",  hex: "#6B9E47" },
  { id: "yellow", name: "黃色族群", color: "var(--hd-species-yellow)", hex: "#D9A441" },
  { id: "brown",  name: "棕色族群", color: "var(--hd-species-brown)",  hex: "#8B6B47" },
  { id: "blue",   name: "藍色族群", color: "var(--hd-species-blue)",   hex: "#4A7BA6" },
  { id: "purple", name: "紫色族群", color: "var(--hd-species-purple)", hex: "#8B5A9F" },
];

// 棲地排列在 2×2 地圖上(左上 wetland / 右上 forest / 左下 urban / 右下 port)
// adjacent 取邊相鄰(不含對角),用於遷移子按鈕
window.HD_HABITATS = [
  {
    id: "wetland",
    name: "濕地農田",
    shortName: "農田",
    enName: "",
    themeColor: "var(--hd-color-wetland)",
    capacity: 300,
    resources: { food: 15, water: 70, vegetation: 50 },
    populations: { red: 0, green: 50, yellow: 30, brown: 0, blue: 80, purple: 20 },
    adjacent: ["forest", "urban"],
  },
  {
    id: "forest",
    name: "淺山森林",
    shortName: "森林",
    enName: "",
    themeColor: "var(--hd-color-forest)",
    capacity: 280,
    resources: { food: 65, water: 45, vegetation: 88 },
    populations: { red: 40, green: 30, yellow: 10, brown: 60, blue: 0, purple: 35 },
    adjacent: ["wetland", "port"],
  },
  {
    id: "urban",
    name: "都會公園",
    shortName: "公園",
    enName: "",
    themeColor: "var(--hd-color-urban)",
    capacity: 220,
    resources: { food: 40, water: 35, vegetation: 25 },
    populations: { red: 20, green: 0, yellow: 50, brown: 30, blue: 10, purple: 0 },
    adjacent: ["wetland", "port"],
  },
  {
    id: "port",
    name: "港口物流",
    shortName: "港口",
    enName: "",
    themeColor: "var(--hd-color-port)",
    capacity: 250,
    resources: { food: 55, water: 80, vegetation: 18 },
    populations: { red: 10, green: 25, yellow: 0, brown: 15, blue: 45, purple: 40 },
    adjacent: ["forest", "urban"],
  },
];

window.HD_TRAITS = {
  unlocked: [
    { id: "fast-breed",     name: "快速繁殖", habitat: "wetland" },
    { id: "water-affinity", name: "親水性",   habitat: "wetland" },
  ],
  locked: [
    { id: "camouflage",   name: "保護色",   hint: "達成 80 隻時解鎖" },
    { id: "night-active", name: "夜行性",   hint: "探索 3 次後解鎖" },
  ],
};

// 玩家狀態(代號與姓名由登入畫面填入,這裡只是預設)
window.HD_PLAYER_DEFAULT = {
  id: "WD-7842",
  name: "王大名",
  species: "blue", // 玩家自己看得到,但畫面上不直接揭露物種名稱
  totalPop: 130,
};

window.HD_GAME = {
  round: 2,
  totalRounds: 5,
  apTotal: 10,
  apRemain: 5,
};

// 行動定義
window.HD_ACTIONS = [
  { id: "forage",  name: "覓食", cost: 1, desc: "每 50 隻需覓食 1 次,不覓食會死 10 隻", icon: "forage" },
  { id: "breed",   name: "繁殖", cost: 1, desc: "在此棲地增加 20 隻", icon: "breed" },
  { id: "migrate", name: "遷移", cost: 1, desc: "每 1 AP 遷出 10 隻到相鄰棲地", icon: "migrate" },
  { id: "explore", name: "探索", cost: 1, desc: "拿一張 NPC 卡牌獲得線索", icon: "explore" },
];

// 生存報告假資料
// habitats 以 habitatId 為 key,每個棲地各有一份結算(beforeCount/afterCount/changes)
// totals 與 event 共用(整個回合的全域資訊)
window.HD_REPORT = {
  round: 2,
  totals: {
    netDelta: 20,
    speciesTotal: 150,
    habitatsOccupied: 3,
  },
  event: {
    id: "black-mist-1",
    title: "黑霧降臨",
    location: "淺山森林",
    sub: "由某個動物的行為觸發",
    quote: "「霧像潮水一樣漫進林子,連腳印都被吞沒了。」",
    effects: [
      { speciesId: "red",    label: "紅色族群數量",    delta: -30, kind: "neg"  },
      { speciesId: "green",  label: "綠色族群數量",    delta: -10, kind: "neg"  },
      { speciesId: "blue",   label: "藍色族群覓食 AP", delta: +1,  kind: "buff", note: "下回合" },
      { speciesId: "yellow", label: "黃色族群覓食 AP", delta: +1,  kind: "buff", note: "下回合" },
    ],
  },
  habitats: {
    wetland: {
      beforeCount: 60,
      afterCount: 80,
      changes: [
        { type: "forage",    name: "覓食",   detail: "成功,全數存活",       delta: 0,   status: "success" },
        { type: "breed",     name: "繁殖",   detail: "成功,於濕地農田增加", delta: 20,  status: "success" },
        { type: "migrate",   name: "遷移",   detail: "自淺山森林遷入",       delta: 10,  status: "inflow" },
        { type: "predation", name: "被吃掉", detail: "天敵活動增加",         delta: -10, status: "negative" },
      ],
    },
    forest: {
      beforeCount: 0,
      afterCount: 0,
      changes: [],
    },
    urban: {
      beforeCount: 10,
      afterCount: 5,
      changes: [
        { type: "forage",    name: "覓食",   detail: "食物不足,部分餓死", delta: -5, status: "negative" },
        { type: "migrate",   name: "遷移",   detail: "尚未進入此棲地",     delta: 0,  status: "success"  },
      ],
    },
    port: {
      beforeCount: 45,
      afterCount: 50,
      changes: [
        { type: "forage", name: "覓食", detail: "成功,於港口物流",   delta: 0,  status: "success" },
        { type: "breed",  name: "繁殖", detail: "成功,於港口物流增加", delta: 5, status: "success" },
      ],
    },
  },
};
