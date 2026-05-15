// survival-report.js — 第 8 頁:生存報告(已合併原本的「一般 / 反思」雙模式)
// 版面固定為:左欄上下堆疊(族群變化 + 觸發事件) + 右欄 AI 對話
// 頂部新增棲地分頁,只列出玩家族群數 > 0 的棲地。
// CTA 直接顯示「結束反思」,結束後回到 action 畫面。

(function () {
  var changeIcon = {
    forage:    "forage",
    breed:     "breed",
    migrate:   "migrate",
    predation: "skull",
  };
  var changeStatusClass = {
    success:  "hd-change--success",
    inflow:   "hd-change--inflow",
    negative: "hd-change--negative",
  };

  // 取玩家族群數 > 0 的棲地清單(分頁來源)
  function playerHabitats(speciesId) {
    var list = [];
    for (var i = 0; i < window.HD_HABITATS.length; i++) {
      var h = window.HD_HABITATS[i];
      var pop = (h.populations && h.populations[speciesId]) || 0;
      if (pop > 0) list.push(h);
    }
    return list;
  }

  // 取得指定棲地的本回合結算(若無,給安全空殼)
  function reportOfHabitat(habitatId) {
    var byHabitat = (window.HD_REPORT && window.HD_REPORT.habitats) || {};
    return byHabitat[habitatId] || { beforeCount: 0, afterCount: 0, changes: [] };
  }

  function renderChangesSection(habitatReport, habitat) {
    var rowsHtml = "";
    if (!habitatReport.changes.length) {
      rowsHtml =
        '<div class="hd-changes-empty">此棲地本回合沒有族群變化</div>';
    } else {
      for (var i = 0; i < habitatReport.changes.length; i++) {
        var c = habitatReport.changes[i];
        var deltaCls =
          c.delta > 0 ? "hd-change__delta--pos" :
          c.delta < 0 ? "hd-change__delta--neg" : "hd-change__delta--neutral";
        var deltaTxt = c.delta > 0 ? "+" + c.delta : c.delta === 0 ? "±0" : ("" + c.delta);
        rowsHtml +=
          '<div class="hd-change ' + (changeStatusClass[c.status] || "") + '" data-change-type="' + c.type + '">' +
            '<div class="hd-change__icon">' + window.hdIconSvg(changeIcon[c.type] || "user", 16) + '</div>' +
            '<div class="hd-change__name">' + c.name + '</div>' +
            '<div class="hd-change__detail">' + c.detail + '</div>' +
            '<div class="hd-change__delta ' + deltaCls + '">' + deltaTxt + ' 隻</div>' +
          '</div>';
      }
    }
    return (
      '<section class="hd-report-changes hd-scroll" data-section="changes">' +
        '<div class="hd-report-changes__head">' +
          '<div class="hd-report-changes__icon">' + window.hdIconSvg(habitat.id, 16) + '</div>' +
          '<div class="hd-report-changes__habitat">' + habitat.name + '</div>' +
          '<div class="hd-report-changes__numline">原先 <strong>' + habitatReport.beforeCount + '</strong> 隻</div>' +
        '</div>' +
        '<div class="hd-changes-list">' + rowsHtml + '</div>' +
        '<div class="hd-changes-final">' +
          '<div class="hd-changes-final__lbl">當前數量</div>' +
          '<div class="hd-changes-final__num">' +
            '<span class="hd-changes-final__from">' + habitatReport.beforeCount + '</span>' +
            '<span class="hd-changes-final__arrow">→</span>' +
            '<span class="hd-changes-final__to">' + habitatReport.afterCount +
              '<small style="font-size:13px;color:var(--hd-ink-muted);font-weight:500;margin-left:3px"> 隻</small>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function renderEventSection(report) {
    var effectsHtml = "";
    for (var i = 0; i < report.event.effects.length; i++) {
      var e = report.event.effects[i];
      var sp = window.HD_SPECIES.find(function (s) { return s.id === e.speciesId; });
      var deltaTxt = (e.delta > 0 ? "+" : "") + e.delta + (e.kind === "buff" ? " AP" : " 隻");
      effectsHtml +=
        '<div class="hd-event-effect" data-species="' + e.speciesId + '">' +
          '<span class="hd-event-effect__dot" style="background:' + sp.color + '"></span>' +
          '<span>' + sp.name +
            '<span class="hd-event-effect__sub">' + e.label + (e.note ? " · " + e.note : "") + '</span>' +
          '</span>' +
          '<span class="hd-event-effect__delta hd-event-effect__delta--' + e.kind + '">' + deltaTxt + '</span>' +
        '</div>';
    }
    return (
      '<section class="hd-event" data-section="event" data-event-id="' + report.event.id + '">' +
        '<div class="hd-event__head">' +
          '<span class="hd-event__badge">⚡ 觸發事件</span>' +
          '<span class="hd-event__location">@ ' + report.event.location + '</span>' +
        '</div>' +
        '<h3 class="hd-event__title">' +
          '某個動物在' + report.event.location + '引來「' + report.event.title + '」' +
        '</h3>' +
        '<div class="hd-event__quote">' + report.event.quote + '</div>' +
        '<div class="hd-event-effects hd-scroll">' + effectsHtml + '</div>' +
      '</section>'
    );
  }

  // 棲地分頁列
  function renderHabitatTabs(habitats, currentId) {
    var tabsHtml = "";
    for (var i = 0; i < habitats.length; i++) {
      var h = habitats[i];
      var active = h.id === currentId;
      tabsHtml +=
        '<button type="button" class="hd-report-tab' + (active ? " hd-report-tab--active" : "") + '" ' +
          'data-habitat-id="' + h.id + '" ' +
          'style="--hd-habitat-color: ' + h.themeColor + '">' +
          '<span class="hd-report-tab__icon">' + window.hdIconSvg(h.id, 14) + '</span>' +
          '<span class="hd-report-tab__name">' + (h.shortName || h.name) + '</span>' +
        '</button>';
    }
    return '<div class="hd-report-tabs">' + tabsHtml + '</div>';
  }

  window.hdRenderReport = function (state) {
    var report = window.HD_REPORT;

    // 找出玩家有族群的棲地;若空(理論上不該發生),退回全部棲地
    var habitats = playerHabitats(state.species);
    if (!habitats.length) habitats = window.HD_HABITATS.slice();

    // 決定當前分頁(state 沒指定或指定的不在玩家棲地清單就重挑)
    var currentId = state.reportHabitatId;
    var isValid = currentId && habitats.some(function (h) { return h.id === currentId; });
    if (!isValid) currentId = habitats[0].id;
    var habitat = habitats.find(function (h) { return h.id === currentId; });
    var habitatReport = reportOfHabitat(currentId);

    // 根節點固定走原本的反思版面(已移除一般模式)
    var root = document.createElement("div");
    root.className = "hd-report hd-report--reflection";
    root.style.setProperty("--hd-habitat-color", habitat.themeColor);

    // head(共用)
    var head = document.createElement("header");
    head.className = "hd-report__head";
    head.innerHTML =
      '<div class="hd-report__head-l">' +
        '<div class="hd-report__round">' + report.round + '<small>/ ' + state.totalRounds + '</small></div>' +
        '<div class="hd-report__title-stack">' +
          '<div class="hd-report__kicker">Survival Report · 第 ' + report.round + ' 回合</div>' +
          '<h2 class="hd-report__title">你的族群發生了什麼變化?</h2>' +
        '</div>' +
      '</div>' +
      '<div class="hd-report-summary">' +
        '<div class="hd-stat-card">' +
          '<div class="hd-stat-card__lbl">本回合淨變化</div>' +
          '<div class="hd-stat-card__val">' +
            (report.totals.netDelta > 0 ? "+" : "") + report.totals.netDelta +
          '</div>' +
          '<div class="hd-stat-card__delta hd-stat-card__delta--pos">↑ 較上回合成長</div>' +
        '</div>' +
        '<div class="hd-stat-card">' +
          '<div class="hd-stat-card__lbl">族群總數</div>' +
          '<div class="hd-stat-card__val">' + report.totals.speciesTotal + '</div>' +
          '<div class="hd-stat-card__delta">分布於 ' + report.totals.habitatsOccupied + ' 個棲地</div>' +
        '</div>' +
      '</div>';
    root.appendChild(head);

    // 左欄:棲地分頁 + 上下堆疊(變化 + 事件)
    var leftStack = document.createElement("div");
    leftStack.className = "hd-report__left-stack";
    leftStack.innerHTML =
      renderHabitatTabs(habitats, currentId) +
      renderChangesSection(habitatReport, habitat) +
      renderEventSection(report);
    root.appendChild(leftStack);

    // 分頁點擊切換
    var tabBtns = leftStack.querySelectorAll(".hd-report-tab");
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].addEventListener("click", function () {
        var id = this.getAttribute("data-habitat-id");
        if (id !== window.HD_STATE.get().reportHabitatId) {
          window.HD_STATE.set({ reportHabitatId: id });
        }
      });
    }

    // 右欄:複用 chat 元件
    root.appendChild(window.hdRenderChat(state, "reflection"));

    // 底部 CTA(結束反思)
    var cta = document.createElement("div");
    cta.className = "hd-report-cta";
    cta.innerHTML =
      '<div class="hd-report-cta__text">' +
        '反思結束後,等老師統一推進下一回合' +
        '<small>對話會被保留,等 AI 串接後可以回顧</small>' +
      '</div>' +
      '<button class="hd-report-cta__btn hd-report-cta__btn--ghost" type="button">結束反思</button>';
    cta.querySelector("button").addEventListener("click", function () {
      // 結束反思:回到 action 畫面,重置倒數與 queued
      window.HD_STATE.set({
        screen: "action",
        reflectionMode: false,
        reportHabitatId: null,
        timerSeconds: 300,
        timerRunning: true,
        queued: [],
      });
    });
    root.appendChild(cta);

    return root;
  };
})();
