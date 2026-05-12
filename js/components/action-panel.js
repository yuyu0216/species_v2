// action-panel.js — 行動選擇列(行動階段地圖下方,水平排列)
// 點覓食/繁殖/探索:把該行動加進 state.queued(綁定當前 habitatId,可重複)
// 點遷移卡內的「→相鄰棲地」小按鈕:加一筆 migrate(habitatId, targetHabitatId)
// 不再有 toggle / disable 樣式,改由 queue-panel 點擊刪除

(function () {
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function pushQueued(item) {
    var current = (window.HD_STATE.get().queued || []).slice();
    current.push(item);
    window.HD_STATE.set({ queued: current });
  }

  // 渲染一張普通行動卡(覓食/繁殖/探索)
  function renderActionCard(action, habitat, apLeft) {
    var card = document.createElement("div");
    var disabled = action.cost > apLeft;
    card.className = "hd-action" + (disabled ? " hd-action--disabled" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", disabled ? "-1" : "0");
    card.setAttribute("data-action", action.id);
    card.innerHTML =
      '<div class="hd-action__icon">' + window.hdIconSvg(action.icon, 18) + '</div>' +
      '<div class="hd-action__body">' +
        '<div class="hd-action__name">' + escapeHtml(action.name) + '</div>' +
        '<div class="hd-action__desc">' + escapeHtml(action.desc) + '</div>' +
      '</div>' +
      '<div class="hd-action__cost">' + action.cost + '<small>AP</small></div>';

    if (!disabled) {
      card.addEventListener("click", function () {
        pushQueued({
          id:        action.id,
          cost:      action.cost,
          habitatId: habitat.id,
        });
      });
    }
    return card;
  }

  // 渲染遷移卡:卡本體不可點,內含兩顆「→相鄰棲地」小按鈕
  function renderMigrateCard(action, habitat, apLeft) {
    var card = document.createElement("div");
    card.className = "hd-action hd-action--migrate";
    card.setAttribute("data-action", action.id);

    var targets = (habitat.adjacent || []).map(function (id) {
      return window.HD_HABITATS.find(function (h) { return h.id === id; });
    }).filter(Boolean);

    var btnsHtml = targets.map(function (t) {
      var disabled = action.cost > apLeft;
      return (
        '<button class="hd-action__sub" type="button" data-target="' + t.id + '"' +
          (disabled ? ' disabled' : '') + '>' +
          '<span class="hd-action__sub-arrow">→</span>' +
          '<span class="hd-action__sub-name">' + escapeHtml(t.shortName || t.name) + '</span>' +
        '</button>'
      );
    }).join("");

    card.innerHTML =
      '<div class="hd-action__icon">' + window.hdIconSvg(action.icon, 18) + '</div>' +
      '<div class="hd-action__body">' +
        '<div class="hd-action__name">' + escapeHtml(action.name) + '</div>' +
        '<div class="hd-action__subs">' + btnsHtml + '</div>' +
      '</div>' +
      '<div class="hd-action__cost">' + action.cost + '<small>AP</small></div>';

    var subs = card.querySelectorAll(".hd-action__sub");
    subs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        pushQueued({
          id:              action.id,
          cost:            action.cost,
          habitatId:       habitat.id,
          targetHabitatId: btn.getAttribute("data-target"),
        });
      });
    });
    return card;
  }

  window.hdRenderActionPanel = function (state) {
    var habitat = window.HD_HABITATS.find(function (h) { return h.id === state.habitatId; });
    if (!habitat) habitat = window.HD_HABITATS[0];

    var queuedCost = (state.queued || []).reduce(function (s, q) { return s + q.cost; }, 0);
    var apLeft = Math.max(0, state.apTotal - queuedCost);

    var section = document.createElement("section");
    section.className = "hd-actbar";
    section.style.setProperty("--hd-habitat-color", habitat.themeColor);

    // 標頭:只保留「於此棲地展開行動」小字,不顯示棲地名稱
    var head = document.createElement("div");
    head.className = "hd-actbar__head";
    head.innerHTML = '<div class="hd-actbar__lbl">於此棲地展開行動</div>';
    section.appendChild(head);

    // 四張行動卡(垂直堆疊)
    var row = document.createElement("div");
    row.className = "hd-actbar__row";
    window.HD_ACTIONS.forEach(function (a) {
      if (a.id === "migrate") row.appendChild(renderMigrateCard(a, habitat, apLeft));
      else                    row.appendChild(renderActionCard(a, habitat, apLeft));
    });
    section.appendChild(row);

    return section;
  };
})();
