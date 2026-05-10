// chat.js — AI 對話視窗
// 同一份元件用在:
//   1. 行動階段地圖下方常駐(mode: "action")
//   2. 生存報告反思模式右欄(mode: "reflection")
//
// 真實 AI 走 HD_API.chat;失敗回「我好累...」(沿用 speciesAI 文案)

(function () {
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function renderMessages(state) {
    var html = "";
    var msgs = state.chatMessages || [];
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      html +=
        '<div class="hd-chat__msg hd-chat__msg--' + m.from + '">' +
          '<div class="hd-chat__bubble">' + escapeHtml(m.text) + '</div>' +
        '</div>';
    }
    // typing 指示器(state.chatTyping = true 時顯示)
    if (state.chatTyping) {
      html +=
        '<div class="hd-chat__msg hd-chat__msg--ai" data-typing="1">' +
          '<div class="hd-chat__bubble hd-chat__typing">' +
            '<span class="hd-chat__typing-dot"></span>' +
            '<span class="hd-chat__typing-dot"></span>' +
            '<span class="hd-chat__typing-dot"></span>' +
          '</div>' +
        '</div>';
    }
    return html;
  }

  function appendMessage(msg) {
    var prev = window.HD_STATE.get().chatMessages || [];
    var next = prev.slice();
    next.push(msg);
    window.HD_STATE.set({ chatMessages: next });
  }

  // mode: "action"(行動階段地圖下方) | "reflection"(報告反思模式右欄)
  window.hdRenderChat = function (state, mode) {
    var root = document.createElement("section");
    root.className = "hd-chat";
    root.setAttribute("data-mode", mode || "action");

    var headTitle = mode === "reflection" ? "個人反思 · AI 對話" : "AI 對話";
    var headSub   = mode === "reflection" ? "你做了什麼?為什麼?" : "可以隨時跟夥伴聊聊";

    root.innerHTML =
      '<header class="hd-chat__head">' +
        '<div class="hd-chat__head-icon">' + window.hdIconSvg("sparkle", 14) + '</div>' +
        '<div class="hd-chat__head-title">' + headTitle + '</div>' +
        '<div class="hd-chat__head-sub">' + headSub + '</div>' +
      '</header>' +
      '<div class="hd-chat__body hd-scroll">' + renderMessages(state) + '</div>' +
      '<form class="hd-chat__form">' +
        '<textarea class="hd-chat__input" rows="1" placeholder="說說你的想法..." maxlength="500"></textarea>' +
        '<button class="hd-chat__send" type="submit">' +
          window.hdIconSvg("send", 14) + '<span>送出</span>' +
        '</button>' +
      '</form>';

    var body  = root.querySelector(".hd-chat__body");
    var form  = root.querySelector(".hd-chat__form");
    var input = root.querySelector(".hd-chat__input");
    var send  = root.querySelector(".hd-chat__send");

    // 自動滾到底
    requestAnimationFrame(function () { body.scrollTop = body.scrollHeight; });

    function refreshDisabled() {
      // typing 中或空白都禁用(規則 6:debounce)
      send.disabled = !input.value.trim() || !!window.HD_STATE.get().chatTyping;
    }
    refreshDisabled();
    input.addEventListener("input", refreshDisabled);

    // typing 中也要禁用 textarea 避免送出 race
    if (state.chatTyping) input.setAttribute("disabled", "disabled");

    // Enter 送出 / Shift+Enter 換行
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit"));
      }
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      // 鎖按鈕,避免重複送出
      var st = window.HD_STATE.get();
      if (st.chatTyping) return;

      var player = st.player || {};
      var payload = {
        name:        player.name || "匿名",
        player_code: player.id   || "ANON",
        message:     text,
        round:       st.round    || 1,
      };

      // 先清空輸入框(router 重繪會抓 textarea 的 value 還原,
      // 不清會把剛送出的訊息又貼回來)
      input.value = "";

      // 1. 推 user 訊息 + 啟動 typing(會觸發 re-render,textarea 會被禁用)
      var prev = st.chatMessages || [];
      window.HD_STATE.set({
        chatMessages: prev.concat([{ from: "user", text: text }]),
        chatTyping:   true,
      });

      // 2. 呼叫 API
      var result = await window.HD_API.chat(payload);

      // 3. 推 AI 回覆;失敗用 fallback 文案(沿用 speciesAI)
      var replyText = (result && result.ok && result.reply)
        ? result.reply
        : "我好累…等等再說好嗎?";
      var prev2 = window.HD_STATE.get().chatMessages || [];
      window.HD_STATE.set({
        chatMessages: prev2.concat([{ from: "ai", text: replyText }]),
        chatTyping:   false,
      });

      // 4. AI 回覆後重新對焦到輸入框,讓使用者直接接著打下一句
      //    (router 的 captureChatInputState 看 activeElement,
      //    AI 思考期間 textarea 是 disabled 所以不在 active,得這裡主動 focus)
      setTimeout(function () {
        var newInput = document.querySelector(".hd-chat__input");
        if (newInput && !newInput.disabled) newInput.focus();
      }, 0);
    });

    return root;
  };
})();
