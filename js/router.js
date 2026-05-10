// router.js — 依 state.screen 切換畫面
// 把對應 component 整塊塞回 #hd-stage,初期不做 diff

(function () {
  function render() {
    var state = window.HD_STATE.get();
    var stage = document.getElementById("hd-stage");
    if (!stage) return;

    // 清空 stage
    stage.innerHTML = "";

    if (state.screen === "login") {
      stage.appendChild(window.hdRenderLogin(state));
      return;
    }

    // 其他畫面共用 TopBar
    stage.appendChild(window.hdRenderTopBar(state));

    if (state.screen === "action") {
      stage.appendChild(window.hdRenderActionScreen(state));
    } else if (state.screen === "report") {
      stage.appendChild(window.hdRenderReport(state));
    }
  }

  window.HD_ROUTER = { render: render };
})();
