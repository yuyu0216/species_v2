// config.js — 全域設定
// 此檔安全可 commit;Apps Script 自己會做存取控制

window.HD_CONFIG = {
  // GAS Web App URL(部署後填入)
  GAS_URL: "https://script.google.com/macros/s/AKfycbzbXbUzP-oTetewcRFEr5nPL6QM9j9H5M8bP8jF2e844osU6coSxppOdWlAoSh5h0RtOg/exec",

  // 設 true 時所有 API 走 mock 不打網路,展示用
  MOCK_MODE: false,

  // 單次 fetch 上限(毫秒);超過自動 abort 視為失敗
  REQUEST_TIMEOUT_MS: 15000,
};
