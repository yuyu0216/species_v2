// action-screen.js — 行動階段三欄組合
// 左:側欄棲地細節 / 中:地圖 + 行動選擇列 / 右:已選擇行動佇列
// (原本中欄底部的 AI 對話已移除,聊天功能僅保留在反思模式)

(function () {
  window.hdRenderActionScreen = function (state) {
    var shell = document.createElement("div");
    shell.className = "hd-shell";

    // 左:側欄
    shell.appendChild(window.hdRenderSidePanel(state));

    // 中:上地圖 + 下行動選擇列
    var mid = document.createElement("div");
    mid.className = "hd-mid";
    mid.appendChild(window.hdRenderHabitatMap(state));
    mid.appendChild(window.hdRenderActionPanel(state));
    shell.appendChild(mid);

    // 右:已選擇行動
    shell.appendChild(window.hdRenderQueuePanel(state));

    return shell;
  };
})();
