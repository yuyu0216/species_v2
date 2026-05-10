// topbar.js — 頂部玩家狀態列
// 順序:logo + 標題 — spacer — 姓名 | 代號 | 倒數 | 回合 | AP 環

(function () {
  window.hdRenderTopBar = function (state) {
    var player = state.player || window.HD_PLAYER_DEFAULT;
    var timerSec = state.timerSeconds;
    var timerCls = "hd-pill hd-pill--timer";
    if (timerSec <= 0) timerCls += " hd-pill--zero";
    else if (timerSec <= 60) timerCls += " hd-pill--low";

    var header = document.createElement("header");
    header.className = "hd-topbar";

    header.innerHTML =
      '<div class="hd-topbar__brand">' +
        '<div class="hd-topbar__logo">誰</div>' +
        '<div>' +
          '<h1 class="hd-topbar__title">誰動了我的棲地!</h1>' +
          '<div class="hd-topbar__subtitle">Habitat Ecology Dashboard</div>' +
        '</div>' +
      '</div>' +
      '<div></div>' + /* spacer */
      '<div class="hd-topbar__player">' +
        // MOCK 模式指示器(只在 HD_CONFIG.MOCK_MODE === true 時顯示)
        (window.HD_CONFIG && window.HD_CONFIG.MOCK_MODE
          ? '<span class="hd-pill hd-pill--mock" title="MOCK 模式:AI 對話走本地 mock,未連線到 GAS">MOCK</span>'
          : '') +
        // 姓名
        '<div class="hd-pill">' +
          '<span style="color:var(--hd-ink-muted);display:inline-flex;align-items:center;">' +
            window.hdIconSvg("user", 14) +
          '</span>' +
          '<span class="hd-pill__label">學生</span>' +
          '<span class="hd-pill__value">' + escapeHtml(player.name) + '</span>' +
        '</div>' +
        // 代號
        '<div class="hd-pill">' +
          '<span class="hd-pill__label">代號</span>' +
          '<span class="hd-pill__value" style="font-family:var(--hd-font-mono)">' +
            escapeHtml(player.id) +
          '</span>' +
        '</div>' +
        // 倒數計時(代號與回合之間)
        '<div class="' + timerCls + '">' +
          '<span style="color:var(--hd-ink-muted);display:inline-flex;align-items:center;">' +
            window.hdIconSvg("timer", 14) +
          '</span>' +
          '<span class="hd-pill__label">倒數</span>' +
          '<span class="hd-pill__value">' + window.hdFormatTime(timerSec) + '</span>' +
        '</div>' +
        // 回合
        '<div class="hd-pill">' +
          '<span class="hd-pill__label">回合</span>' +
          '<span class="hd-pill__value">' +
            state.round + ' / ' + state.totalRounds +
          '</span>' +
        '</div>' +
        // AP 環
        '<div class="hd-roundgauge">' +
          '<div class="hd-roundgauge__ring">' +
            window.hdRoundGaugeSvg(state.apRemain, state.apTotal) +
            '<div class="hd-roundgauge__center">' + state.apRemain + '</div>' +
          '</div>' +
          '<div>' +
            '<div class="hd-roundgauge__meta">剩餘 AP</div>' +
            '<div class="hd-roundgauge__big">/ ' + state.apTotal + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    return header;
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
