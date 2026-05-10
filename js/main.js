// main.js — 應用入口
// 1. 啟動 router 第一次渲染
// 2. 訂閱 state 變更觸發重繪
// 3. 監聽 resize 算 transform: scale 讓 1180×820 舞台塞進視窗

(function () {
  function fitStage() {
    var stage = document.getElementById("hd-stage");
    if (!stage) return;
    var sx = window.innerWidth  / 1180;
    var sy = window.innerHeight / 820;
    var s  = Math.min(sx, sy, 1) * 0.98;
    stage.style.transform = "scale(" + s + ")";
  }

  function start() {
    // 啟動時若 sessionStorage 有學生資訊,直接還原進入 action 畫面
    var saved = window.HD_SESSION && window.HD_SESSION.getStudent();
    if (saved && saved.name && saved.player_code) {
      window.HD_STATE.set({
        player: { name: saved.name, id: saved.player_code },
        screen: "action",
        timerRunning: true,
      });
    }

    window.HD_ROUTER.render();
    window.HD_STATE.subscribe(function () {
      window.HD_ROUTER.render();
    });
    fitStage();
    window.addEventListener("resize", fitStage);
    // 倒數計時器常駐運作,由 state.timerRunning 控制是否扣秒
    window.HD_TIMER.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
