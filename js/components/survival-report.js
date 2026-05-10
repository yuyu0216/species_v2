// survival-report.js — 第 8 頁:生存報告
// 一般模式:左數量變化 + 右觸發事件 + 底部「開始反思」CTA
// 反思模式:左欄變上下堆疊(變化+事件壓縮),右欄改 AI 對話,CTA 變「結束反思」

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

  function renderChangesSection(report, habitat) {
    var rowsHtml = "";
    for (var i = 0; i < report.changes.length; i++) {
      var c = report.changes[i];
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
    return (
      '<section class="hd-report-changes hd-scroll" data-section="changes">' +
        '<div class="hd-report-changes__head">' +
          '<div class="hd-report-changes__icon">' + window.hdIconSvg(habitat.id, 16) + '</div>' +
          '<div class="hd-report-changes__habitat">' + habitat.name + '</div>' +
          '<div class="hd-report-changes__numline">原先 <strong>' + report.beforeCount + '</strong> 隻</div>' +
        '</div>' +
        '<div class="hd-changes-list">' + rowsHtml + '</div>' +
        '<div class="hd-changes-final">' +
          '<div class="hd-changes-final__lbl">當前數量</div>' +
          '<div class="hd-changes-final__num">' +
            '<span class="hd-changes-final__from">' + report.beforeCount + '</span>' +
            '<span class="hd-changes-final__arrow">→</span>' +
            '<span class="hd-changes-final__to">' + report.afterCount +
              '<small style="font-size:11px;color:var(--hd-ink-muted);font-weight:500;margin-left:3px"> 隻</small>' +
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

  window.hdRenderReport = function (state) {
    var report = window.HD_REPORT;
    var habitat = window.HD_HABITATS.find(function (h) { return h.id === report.habitatId; });
    var reflection = !!state.reflectionMode;

    var root = document.createElement("div");
    root.className = "hd-report" + (reflection ? " hd-report--reflection" : "");
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

    // 主要內容
    if (!reflection) {
      // 一般模式:左數量變化 + 右觸發事件
      var changesWrap = document.createElement("div");
      changesWrap.style.minHeight = "0";
      changesWrap.innerHTML = renderChangesSection(report, habitat);
      root.appendChild(changesWrap.firstElementChild);

      var eventWrap = document.createElement("div");
      eventWrap.style.minHeight = "0";
      eventWrap.innerHTML = renderEventSection(report);
      root.appendChild(eventWrap.firstElementChild);
    } else {
      // 反思模式:左欄堆疊(變化+事件) + 右欄 AI 對話
      var leftStack = document.createElement("div");
      leftStack.className = "hd-report__left-stack";
      leftStack.innerHTML = renderChangesSection(report, habitat) + renderEventSection(report);
      root.appendChild(leftStack);

      // 右欄:複用 chat 元件
      root.appendChild(window.hdRenderChat(state, "reflection"));
    }

    // 底部 CTA
    var cta = document.createElement("div");
    cta.className = "hd-report-cta";
    if (!reflection) {
      cta.innerHTML =
        '<div class="hd-report-cta__text">' +
          '準備好進入個人反思階段' +
          '<small>與 AI 聊聊:你做了什麼?為什麼?你覺得發生了什麼變化?</small>' +
        '</div>' +
        '<button class="hd-report-cta__btn" type="button">開始反思 →</button>';
      cta.querySelector("button").addEventListener("click", function () {
        window.HD_STATE.set({ reflectionMode: true });
      });
    } else {
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
          timerSeconds: 300,
          timerRunning: true,
          queued: [],
        });
      });
    }
    root.appendChild(cta);

    return root;
  };
})();
