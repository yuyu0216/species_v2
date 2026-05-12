// state.js — 全域狀態 + 簡易 pub/sub
// 用法:
//   HD_STATE.get()                  → 取當前 state
//   HD_STATE.set({ key: val, ... }) → 局部更新並通知所有訂閱者
//   HD_STATE.subscribe(fn)          → 註冊變更回呼,回傳取消訂閱函式

(function () {
  var state = {
    screen: "login",                // login | action | report
    player: null,                   // { name, id }(由登入畫面填入)
    species: "blue",                // 玩家扮演的物種
    habitatId: "wetland",           // 當前選中的棲地
    round: 2,
    totalRounds: 5,
    apTotal: 10,
    // 已排入的行動;每項 { id, cost, habitatId, targetHabitatId? }
    // 可重複,點擊「已選擇行動」條目可刪除。
    // 剩餘 AP 由 apTotal - sum(queued.cost) 動態算出,不存在 state
    queued: [],
    timerSeconds: 300,              // 5:00 倒數
    timerRunning: false,
    chatMessages: [                 // AI 對話訊息(共用於行動階段與反思模式)
      { from: "ai", text: "嗨,我陪你玩這一回合。有任何想法都可以告訴我。" },
    ],
    reflectionMode: false,          // 生存報告中的反思模式開關
  };

  var listeners = [];

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](state); } catch (e) { console.error(e); }
    }
  }

  window.HD_STATE = {
    get: function () { return state; },

    set: function (patch) {
      // 淺合併;陣列/物件需要整個替換,呼叫端自行處理
      for (var k in patch) {
        if (Object.prototype.hasOwnProperty.call(patch, k)) {
          state[k] = patch[k];
        }
      }
      notify();
    },

    // 不觸發 re-render 的更新(用於高頻欄位如 timerSeconds,
    // 由呼叫方自行更新需要的 DOM)
    setSilent: function (patch) {
      for (var k in patch) {
        if (Object.prototype.hasOwnProperty.call(patch, k)) {
          state[k] = patch[k];
        }
      }
    },

    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        var i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      };
    },
  };
})();
