// login.js — 登入畫面
// 學生輸入姓名與玩家代號 → 進入行動階段

(function () {
  window.hdRenderLogin = function (state) {
    var root = document.createElement("div");
    root.className = "hd-login";
    root.innerHTML =
      '<form class="hd-login__card" novalidate>' +
        '<div class="hd-login__brand">' +
          '<div class="hd-login__logo">誰</div>' +
          '<div class="hd-login__brand-text">' +
            '<h1 class="hd-login__title">誰動了我的棲地!</h1>' +
            '<div class="hd-login__kicker">Habitat Ecology Dashboard</div>' +
          '</div>' +
        '</div>' +
        '<p class="hd-login__subtitle">' +
          '輸入你的姓名與玩家代號,進入這一輪的棲地觀察。' +
        '</p>' +
        '<div class="hd-login__fields">' +
          '<label class="hd-login__field">' +
            '<span class="hd-login__label">姓名</span>' +
            '<input class="hd-login__input" name="name" type="text" ' +
              'autocomplete="off" placeholder="例如:王大名" required />' +
          '</label>' +
          '<label class="hd-login__field">' +
            '<span class="hd-login__label">玩家代號</span>' +
            '<input class="hd-login__input hd-login__input--code" name="code" type="text" ' +
              'autocomplete="off" placeholder="例如:WD-7842" maxlength="10" required />' +
          '</label>' +
        '</div>' +
        '<button class="hd-login__submit" type="submit">進入遊戲 →</button>' +
        '<p class="hd-login__hint">老師會在課堂上發給你代號。</p>' +
      '</form>';

    var form  = root.querySelector("form");
    var name  = root.querySelector('input[name="name"]');
    var code  = root.querySelector('input[name="code"]');
    var btn   = root.querySelector(".hd-login__submit");

    function refreshDisabled() {
      btn.disabled = !(name.value.trim() && code.value.trim());
    }
    name.addEventListener("input", refreshDisabled);
    code.addEventListener("input", refreshDisabled);
    refreshDisabled();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = name.value.trim();
      var c = code.value.trim().toUpperCase();
      if (!n || !c) return;
      // 寫進 sessionStorage,刷新不會掉
      window.HD_SESSION.setStudent({ name: n, player_code: c });
      window.HD_STATE.set({
        player: { name: n, id: c },
        screen: "action",
        timerSeconds: 300,
        timerRunning: true,
      });
    });

    // 自動 focus 第一個輸入框
    setTimeout(function () { name.focus(); }, 0);

    return root;
  };
})();
