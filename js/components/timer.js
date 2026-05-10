// timer.js — 5 分鐘倒數計時器
// 由 main.js 啟動後常駐運作,只要 state.timerRunning && timerSeconds > 0 就每秒減 1
// 歸零後停在 0 + TopBar 紅色閃爍(視覺由 CSS 處理),不自動執行任何行動

(function () {
  var intervalId = null;

  function tick() {
    var s = window.HD_STATE.get();
    if (!s.timerRunning) return;
    if (s.timerSeconds <= 0) return;
    var next = s.timerSeconds - 1;
    window.HD_STATE.set({ timerSeconds: next });
  }

  // 啟動全域計時器(整個 app 只需要一個)
  window.HD_TIMER = {
    start: function () {
      if (intervalId) return;
      intervalId = setInterval(tick, 1000);
    },
    stop: function () {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    },
    reset: function (seconds) {
      window.HD_STATE.set({
        timerSeconds: seconds == null ? 300 : seconds,
        timerRunning: true,
      });
    },
  };

  // 工具:把秒數格式化成 MM:SS
  window.hdFormatTime = function (sec) {
    var s = Math.max(0, Math.floor(sec));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? "0" + m : "" + m) + ":" + (r < 10 ? "0" + r : "" + r);
  };
})();
