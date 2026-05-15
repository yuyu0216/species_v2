// action-screen.js — 行動階段(平板 1366×900 兩欄式)
// 左 .hd-main(列):上=地圖 2×2  下=底列三張卡(棲地詳情 / 族群分布+性狀 / AI 對話)
// 右 .hd-side(欄):行動選擇 4 張卡 + 已選擇佇列 + 展開行動

(function () {
  window.hdRenderActionScreen = function (state) {
    var shell = document.createElement("div");
    shell.className = "hd-shell";

    // ── 左大欄:地圖(上) + 底列(下) ──
    var main = document.createElement("div");
    main.className = "hd-main";

    main.appendChild(window.hdRenderHabitatMap(state));

    var botrow = document.createElement("div");
    botrow.className = "hd-botrow";
    botrow.appendChild(window.hdRenderHabitatDetail(state));
    botrow.appendChild(window.hdRenderMyStatus(state));
    botrow.appendChild(window.hdRenderChat(state, "action"));
    main.appendChild(botrow);

    shell.appendChild(main);

    // ── 右側欄:行動選擇 + 佇列 ──
    var side = document.createElement("aside");
    side.className = "hd-side";
    side.appendChild(window.hdRenderActionPanel(state));
    side.appendChild(window.hdRenderQueuePanel(state));
    shell.appendChild(side);

    return shell;
  };
})();
