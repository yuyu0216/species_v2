// action-screen.js — 行動階段三欄組合
// 左:側欄棲地細節 / 中:地圖 + 對話 / 右:行動面板

(function () {
  window.hdRenderActionScreen = function (state) {
    var shell = document.createElement("div");
    shell.className = "hd-shell";

    // 左:側欄
    shell.appendChild(window.hdRenderSidePanel(state));

    // 中:上地圖 + 下對話
    var mid = document.createElement("div");
    mid.className = "hd-mid";
    mid.appendChild(window.hdRenderHabitatMap(state));
    mid.appendChild(window.hdRenderChat(state, "action"));
    shell.appendChild(mid);

    // 右:行動面板
    shell.appendChild(window.hdRenderActionPanel(state));

    return shell;
  };
})();
