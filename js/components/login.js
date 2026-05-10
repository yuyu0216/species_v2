// login.js — 登入畫面
// 學生輸入姓名與玩家代號 → 呼叫 HD_API.login 比對 students 分頁
// 通過才進入行動階段;比對失敗顯示錯誤訊息,輸入框內容保留讓使用者改

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
        '<div class="hd-login__error" role="alert"></div>' +
        '<button class="hd-login__submit" type="submit"><span>進入遊戲 →</span></button>' +
        '<p class="hd-login__hint">老師會在課堂上發給你代號。</p>' +
      '</form>';

    var form    = root.querySelector("form");
    var name    = root.querySelector('input[name="name"]');
    var code    = root.querySelector('input[name="code"]');
    var btn     = root.querySelector(".hd-login__submit");
    var btnText = btn.querySelector("span");
    var errBox  = root.querySelector(".hd-login__error");

    function refreshDisabled() {
      btn.disabled = !(name.value.trim() && code.value.trim());
    }
    name.addEventListener("input", function () { hideError(); refreshDisabled(); });
    code.addEventListener("input", function () { hideError(); refreshDisabled(); });
    refreshDisabled();

    function showError(msg) {
      errBox.textContent = "⚠ " + msg;
      errBox.classList.add("is-visible");
    }
    function hideError() {
      errBox.classList.remove("is-visible");
    }
    function setLoading(on) {
      if (on) {
        btn.disabled = true;
        btn.classList.add("is-loading");
        btnText.textContent = "驗證中...";
        name.disabled = true;
        code.disabled = true;
      } else {
        btn.classList.remove("is-loading");
        btnText.textContent = "進入遊戲 →";
        name.disabled = false;
        code.disabled = false;
        refreshDisabled();
      }
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (btn.disabled) return;

      var n = name.value.trim();
      var c = code.value.trim().toUpperCase();
      if (!n || !c) return;

      setLoading(true);

      var result = await window.HD_API.login(n, c);

      if (!result || !result.ok) {
        showError((result && result.error) || "登入失敗,請確認姓名與代號");
        setLoading(false);
        return;
      }

      // 成功:寫進 sessionStorage(刷新不會掉)+ 進入 action
      window.HD_SESSION.setStudent({
        name:        result.name,
        player_code: result.player_code,
      });
      window.HD_STATE.set({
        player: { name: result.name, id: result.player_code },
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
