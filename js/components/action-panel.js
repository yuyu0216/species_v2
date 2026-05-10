// action-panel.js — 右欄行動面板
// 四個行動可加入/移除佇列;遷移子選項 / 探索代號輸入暫不實作互動

(function () {
  window.hdRenderActionPanel = function (state) {
    var habitat = window.HD_HABITATS.find(function (h) { return h.id === state.habitatId; });
    if (!habitat) habitat = window.HD_HABITATS[0];

    var queued = state.queued || [];
    var queuedCost = queued.reduce(function (s, q) { return s + q.cost; }, 0);
    var canExecute = queued.length > 0 && queuedCost <= state.apRemain;

    var aside = document.createElement("aside");
    aside.className = "hd-actions";
    aside.style.setProperty("--hd-habitat-color", habitat.themeColor);

    // banner
    var banner = document.createElement("div");
    banner.className = "hd-action-banner";
    banner.innerHTML =
      '<div class="hd-action-banner__lbl">於此棲地展開行動</div>' +
      '<div class="hd-action-banner__name">' + habitat.name + '</div>';
    aside.appendChild(banner);

    // list
    var list = document.createElement("div");
    list.className = "hd-action-list hd-scroll";

    window.HD_ACTIONS.forEach(function (a) {
      var q = queued.find(function (x) { return x.id === a.id; });
      var isQueued = !!q;
      var disabled = !isQueued && (a.cost > state.apRemain - queuedCost);

      var row = document.createElement("div");
      row.className = "hd-action" +
        (isQueued ? " hd-action--queued" : "") +
        (disabled ? " hd-action--disabled" : "");
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", disabled ? "-1" : "0");
      row.setAttribute("data-action", a.id);
      row.innerHTML =
        '<div class="hd-action__icon">' + window.hdIconSvg(a.icon, 18) + '</div>' +
        '<div class="hd-action__body">' +
          '<div class="hd-action__name">' + a.name + '</div>' +
          '<div class="hd-action__desc">' + a.desc + '</div>' +
        '</div>' +
        '<div class="hd-action__cost">' +
          a.cost + '<small>AP</small>' +
        '</div>';

      // TODO:遷移子選項與探索代號輸入,等執行流程確認後再補

      if (!disabled) {
        row.addEventListener("click", function () {
          var current = state.queued.slice();
          var idx = current.findIndex(function (x) { return x.id === a.id; });
          if (idx >= 0) current.splice(idx, 1);
          else current.push({ id: a.id, cost: a.cost });
          window.HD_STATE.set({ queued: current });
        });
      }

      list.appendChild(row);
    });

    aside.appendChild(list);

    // execute button
    var btn = document.createElement("button");
    btn.className = "hd-execute";
    btn.disabled = !canExecute;
    btn.innerHTML =
      '<span>展開行動</span>' +
      '<span class="hd-execute__cost">花費 ' + queuedCost + ' / ' + state.apRemain + ' AP</span>';
    btn.addEventListener("click", function () {
      // 暫接報告畫面;之後改 HD_API.postActions(queued)
      window.HD_STATE.set({ screen: "report", reflectionMode: false, timerRunning: false });
    });
    aside.appendChild(btn);

    return aside;
  };
})();
