// queue-panel.js — 右欄「已選擇行動」
// 顯示 state.queued,每項一個條目,例如「農田-覓食」「農田→森林(遷移)」
// 點擊條目刪除該筆;最多 10 格高度,超過捲動
// 底部「展開行動」按鈕沿用原本的 hd-execute

(function () {
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function habitatShort(id) {
    var h = window.HD_HABITATS.find(function (x) { return x.id === id; });
    return h ? (h.shortName || h.name) : id;
  }

  function actionDef(id) {
    return window.HD_ACTIONS.find(function (x) { return x.id === id; });
  }

  // 文字化一筆 queued 項目
  function describeItem(item) {
    var act = actionDef(item.id);
    var actName = act ? act.name : item.id;
    if (item.id === "migrate" && item.targetHabitatId) {
      return habitatShort(item.habitatId) + " → " + habitatShort(item.targetHabitatId);
    }
    return habitatShort(item.habitatId) + " · " + actName;
  }

  function removeAt(index) {
    var next = (window.HD_STATE.get().queued || []).slice();
    next.splice(index, 1);
    window.HD_STATE.set({ queued: next });
  }

  window.hdRenderQueuePanel = function (state) {
    var queued = state.queued || [];
    var queuedCost = queued.reduce(function (s, q) { return s + (q.cost || 0); }, 0);
    var apLeft = Math.max(0, state.apTotal - queuedCost);
    var canExecute = queued.length > 0 && queuedCost <= state.apTotal;

    var aside = document.createElement("aside");
    aside.className = "hd-queue";

    // 標頭
    var head = document.createElement("div");
    head.className = "hd-queue__head";
    head.innerHTML =
      '<div class="hd-queue__title">已選擇行動</div>' +
      '<div class="hd-queue__meta">' +
        '<span class="hd-queue__count">' + queued.length + '</span>' +
        '<span class="hd-queue__cost">花費 ' + queuedCost + ' / ' + state.apTotal + ' AP</span>' +
      '</div>';
    aside.appendChild(head);

    // 條目清單(空狀態 / 有內容)
    var list = document.createElement("div");
    list.className = "hd-queue__list hd-scroll";
    if (!queued.length) {
      list.innerHTML =
        '<div class="hd-queue__empty">' +
          '從下方選擇行動,項目會出現在這裡。<br/>' +
          '點擊條目可以刪除。' +
        '</div>';
    } else {
      queued.forEach(function (item, i) {
        var isMig = item.id === "migrate";
        var row = document.createElement("button");
        row.type = "button";
        row.className = "hd-queue__item" + (isMig ? " hd-queue__item--migrate" : "");
        row.setAttribute("data-index", i);
        row.innerHTML =
          '<span class="hd-queue__idx">' + (i + 1) + '</span>' +
          '<span class="hd-queue__text">' + escapeHtml(describeItem(item)) + '</span>' +
          '<span class="hd-queue__ap">-' + item.cost + ' AP</span>' +
          '<span class="hd-queue__x" aria-hidden="true">×</span>';
        row.title = "點擊刪除";
        row.addEventListener("click", function () { removeAt(i); });
        list.appendChild(row);
      });
    }
    aside.appendChild(list);

    // 剩餘 AP 提示
    var foot = document.createElement("div");
    foot.className = "hd-queue__remain";
    foot.innerHTML = '剩餘 AP <strong>' + apLeft + '</strong> / ' + state.apTotal;
    aside.appendChild(foot);

    // 展開行動
    var btn = document.createElement("button");
    btn.className = "hd-execute";
    btn.disabled = !canExecute;
    btn.innerHTML =
      '<span>展開行動</span>' +
      '<span class="hd-execute__cost">' + queued.length + ' 項 · ' + queuedCost + ' AP</span>';
    btn.addEventListener("click", function () {
      // Phase B 才送 API;目前直接接報告畫面
      window.HD_STATE.set({ screen: "report", reflectionMode: false, timerRunning: false });
    });
    aside.appendChild(btn);

    return aside;
  };
})();
