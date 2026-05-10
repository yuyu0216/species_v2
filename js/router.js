// router.js — 依 state.screen 切換畫面
// 把對應 component 整塊塞回 #hd-stage,初期不做 diff
//
// 關鍵:re-render 前後保留 chat textarea 的 value、游標位置、focus,
// 否則使用者切棲地、加減行動時打到一半的訊息會消失、輸入框會掉焦點。

(function () {
  function captureChatInputState() {
    var el = document.activeElement;
    if (!el || !el.classList || !el.classList.contains("hd-chat__input")) return null;
    return {
      value:    el.value,
      selStart: el.selectionStart,
      selEnd:   el.selectionEnd,
    };
  }

  function restoreChatInputState(snap) {
    if (!snap) return;
    var el = document.querySelector(".hd-chat__input");
    if (!el || el.disabled) return;
    el.value = snap.value;
    el.focus();
    try { el.setSelectionRange(snap.selStart, snap.selEnd); } catch (_) {}
  }

  function render() {
    var state = window.HD_STATE.get();
    var stage = document.getElementById("hd-stage");
    if (!stage) return;

    // 1. 在清空之前抓 chat textarea 狀態
    var chatSnap = captureChatInputState();

    // 2. 清空 stage,重新渲染
    stage.innerHTML = "";

    if (state.screen === "login") {
      stage.appendChild(window.hdRenderLogin(state));
      // login 畫面不需要 chat 還原
      return;
    }

    // 其他畫面共用 TopBar
    stage.appendChild(window.hdRenderTopBar(state));

    if (state.screen === "action") {
      stage.appendChild(window.hdRenderActionScreen(state));
    } else if (state.screen === "report") {
      stage.appendChild(window.hdRenderReport(state));
    }

    // 3. 還原 chat textarea(若 re-render 前有焦點且新元素可寫入)
    restoreChatInputState(chatSnap);
  }

  window.HD_ROUTER = { render: render };
})();
