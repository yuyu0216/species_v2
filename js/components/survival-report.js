// survival-report.js — 第 8 頁:生存報告(平板版三區式)
// 版面:
//   左 3/5 區:上=族群變化(+棲地分頁) | 觸發事件   下=偵查報告紀錄 | 新偵查報告內容
//   右 2/5 區:AI 對話(縱向貫穿)
// 頂部:回合 / 標題 / 統計;底部:結束反思 CTA

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

  function playerHabitats(speciesId) {
    var list = [];
    for (var i = 0; i < window.HD_HABITATS.length; i++) {
      var h = window.HD_HABITATS[i];
      var pop = (h.populations && h.populations[speciesId]) || 0;
      if (pop > 0) list.push(h);
    }
    return list;
  }

  function reportOfHabitat(habitatId) {
    var byHabitat = (window.HD_REPORT && window.HD_REPORT.habitats) || {};
    return byHabitat[habitatId] || { beforeCount: 0, afterCount: 0, changes: [] };
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

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

  function renderChangesSection(habitatReport, habitat) {
    var rowsHtml = "";
    if (!habitatReport.changes.length) {
      rowsHtml = '<div class="hd-changes-empty">此棲地本回合沒有族群變化</div>';
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

  function roundLabel(n) {
    var map = { 1: "第一回合", 2: "第二回合", 3: "第三回合", 4: "第四回合", 5: "第五回合" };
    return map[n] || ("第 " + n + " 回合");
  }

  // 偵查報告紀錄列表(左下)
  function renderReconList(logs, selectedId) {
    var rowsHtml = "";
    for (var i = 0; i < logs.length; i++) {
      var log = logs[i];
      var active = log.id === selectedId;
      rowsHtml +=
        '<button type="button" class="hd-recon-list__item' + (active ? " hd-recon-list__item--active" : "") + '" ' +
          'data-recon-id="' + log.id + '">' +
          '<span class="hd-recon-list__id">' + escapeHtml(log.id) + '</span>' +
          '<span class="hd-recon-list__lbl">偵查報告</span>' +
          '<span class="hd-recon-list__round">' + roundLabel(log.round) + '</span>' +
        '</button>';
    }
    return (
      '<section class="hd-recon-list" data-section="recon-list">' +
        '<h3 class="hd-recon-list__title">偵查報告紀錄</h3>' +
        '<div class="hd-recon-list__rows hd-scroll">' + rowsHtml + '</div>' +
      '</section>'
    );
  }

  // 偵查報告內容(右下)
  function renderReconDetail(log) {
    if (!log) {
      return (
        '<section class="hd-recon-detail hd-recon-detail--empty" data-section="recon-detail">' +
          '<div class="hd-recon-detail__placeholder">尚無偵查報告</div>' +
        '</section>'
      );
    }
    var lines = String(log.content || "").split("\n").map(function (ln) {
      return '<p class="hd-recon-detail__line">' + escapeHtml(ln) + '</p>';
    }).join("");
    var unlockedText = log.unlocked ? escapeHtml(log.unlocked) : "無";
    var unlockedCls  = log.unlocked ? "hd-recon-detail__unlocked--has" : "hd-recon-detail__unlocked--none";
    return (
      '<section class="hd-recon-detail" data-section="recon-detail">' +
        '<header class="hd-recon-detail__head">' +
          '<span class="hd-recon-detail__id">' + escapeHtml(log.id) + '</span>' +
          '<h3 class="hd-recon-detail__title">' + escapeHtml(log.title || "新的偵查報告") + '</h3>' +
          '<span class="hd-recon-detail__round">' + roundLabel(log.round) + '</span>' +
        '</header>' +
        '<div class="hd-recon-detail__body hd-scroll">' + lines + '</div>' +
        '<footer class="hd-recon-detail__foot ' + unlockedCls + '">' +
          '<span class="hd-recon-detail__foot-lbl">解鎖性狀</span>' +
          '<span class="hd-recon-detail__foot-val">' + unlockedText + '</span>' +
        '</footer>' +
      '</section>'
    );
  }

  window.hdRenderReport = function (state) {
    var report = window.HD_REPORT;

    // 棲地分頁
    var habitats = playerHabitats(state.species);
    if (!habitats.length) habitats = window.HD_HABITATS.slice();
    var currentId = state.reportHabitatId;
    var isValid = currentId && habitats.some(function (h) { return h.id === currentId; });
    if (!isValid) currentId = habitats[0].id;
    var habitat = habitats.find(function (h) { return h.id === currentId; });
    var habitatReport = reportOfHabitat(currentId);

    // 偵查報告(預設選最新一筆,即 logs[0])
    var logs = (window.HD_REPORT_LOGS || []).slice();
    var selectedLogId = state.selectedReportLogId;
    var validLog = selectedLogId && logs.some(function (l) { return l.id === selectedLogId; });
    if (!validLog) selectedLogId = logs.length ? logs[0].id : null;
    var selectedLog = logs.find(function (l) { return l.id === selectedLogId; });

    // 根節點
    var root = document.createElement("div");
    root.className = "hd-report hd-report--reflection";
    root.style.setProperty("--hd-habitat-color", habitat.themeColor);

    // 頂部 head(跨整個寬度)
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

    // 左 3/5 區:上(變化 + 事件)、下(偵查列表 + 內容)
    var main = document.createElement("div");
    main.className = "hd-report__main";

    var topRow = document.createElement("div");
    topRow.className = "hd-report__top";

    // 變化(含棲地分頁)
    var changesWrap = document.createElement("div");
    changesWrap.className = "hd-report__changes-wrap";
    changesWrap.innerHTML =
      renderHabitatTabs(habitats, currentId) +
      renderChangesSection(habitatReport, habitat);
    topRow.appendChild(changesWrap);

    // 事件
    var eventWrap = document.createElement("div");
    eventWrap.innerHTML = renderEventSection(report);
    topRow.appendChild(eventWrap.firstElementChild);

    main.appendChild(topRow);

    // 下:偵查列表 + 內容
    var botRow = document.createElement("div");
    botRow.className = "hd-report__bot";
    botRow.innerHTML = renderReconList(logs, selectedLogId);
    var detailWrap = document.createElement("div");
    detailWrap.innerHTML = renderReconDetail(selectedLog);
    botRow.appendChild(detailWrap.firstElementChild);
    main.appendChild(botRow);

    root.appendChild(main);

    // 分頁 / 偵查列表點擊
    var tabBtns = main.querySelectorAll(".hd-report-tab");
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].addEventListener("click", function () {
        var id = this.getAttribute("data-habitat-id");
        if (id !== window.HD_STATE.get().reportHabitatId) {
          window.HD_STATE.set({ reportHabitatId: id });
        }
      });
    }
    var reconBtns = main.querySelectorAll(".hd-recon-list__item");
    for (var j = 0; j < reconBtns.length; j++) {
      reconBtns[j].addEventListener("click", function () {
        var id = this.getAttribute("data-recon-id");
        if (id !== window.HD_STATE.get().selectedReportLogId) {
          window.HD_STATE.set({ selectedReportLogId: id });
        }
      });
    }

    // 右 2/5 區:AI 對話
    var chatAside = document.createElement("aside");
    chatAside.className = "hd-report__chat";
    chatAside.appendChild(window.hdRenderChat(state, "reflection"));
    root.appendChild(chatAside);

    // 底部 CTA
    var cta = document.createElement("div");
    cta.className = "hd-report-cta";
    cta.innerHTML =
      '<div class="hd-report-cta__text">' +
        '反思結束後,等老師統一推進下一回合' +
        '<small>對話會被保留,等 AI 串接後可以回顧</small>' +
      '</div>' +
      '<button class="hd-report-cta__btn hd-report-cta__btn--ghost" type="button">結束反思</button>';
    cta.querySelector("button").addEventListener("click", function () {
      window.HD_STATE.set({
        screen: "action",
        reflectionMode: false,
        reportHabitatId: null,
        selectedReportLogId: null,
        timerSeconds: 300,
        timerRunning: true,
        queued: [],
      });
    });
    root.appendChild(cta);

    return root;
  };
})();
