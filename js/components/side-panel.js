// side-panel.js — 左欄:選中棲地的環境資料
// 包含三張卡:總覽(資源條)、族群分布、性狀

(function () {
  function resourceLevel(pct) {
    if (pct < 30) return "low";
    if (pct < 60) return "mid";
    return "high";
  }

  function renderResource(icon, label, pct) {
    var lvl = resourceLevel(pct);
    return (
      '<div class="hd-resource hd-resource--' + lvl + '" data-resource="' + label + '">' +
        '<div class="hd-resource__head">' +
          '<div class="hd-resource__label">' +
            '<span class="hd-resource__icon">' + window.hdIconSvg(icon, 16) + '</span>' +
            label +
          '</div>' +
          '<div class="hd-resource__pct">' + pct + '<small>%</small></div>' +
        '</div>' +
        '<div class="hd-resource__bar">' +
          '<div class="hd-resource__bar-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>'
    );
  }

  window.hdRenderSidePanel = function (state) {
    var habitat = window.HD_HABITATS.find(function (h) { return h.id === state.habitatId; });
    if (!habitat) habitat = window.HD_HABITATS[0];

    var total = 0;
    for (var k in habitat.populations) total += habitat.populations[k];

    // 族群分布列(依數量排序)
    var popRows = window.HD_SPECIES
      .map(function (sp) { return { sp: sp, count: habitat.populations[sp.id] || 0 }; })
      .sort(function (a, b) { return b.count - a.count; });

    var aside = document.createElement("aside");
    aside.className = "hd-side-l hd-scroll";
    aside.style.setProperty("--hd-habitat-color", habitat.themeColor);

    var html = "";

    // 總覽 + 資源
    html +=
      '<div class="hd-detail-card">' +
        '<div class="hd-detail-card__head">' +
          '<div class="hd-detail-card__icon">' + window.hdIconSvg(habitat.id, 18) + '</div>' +
          '<div>' +
            '<div class="hd-detail-card__name">' + habitat.name + '</div>' +
            '<div class="hd-detail-card__capacity">已承載 <strong>' + total + '</strong> / ' + habitat.capacity + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="hd-resources">' +
          renderResource("food",       "食物", habitat.resources.food) +
          renderResource("water",      "水源", habitat.resources.water) +
          renderResource("vegetation", "植被", habitat.resources.vegetation) +
        '</div>' +
      '</div>';

    // 族群分布
    var rowsHtml = "";
    for (var i = 0; i < popRows.length; i++) {
      var sp = popRows[i].sp;
      var count = popRows[i].count;
      var isSelf = sp.id === state.species;
      rowsHtml +=
        '<div class="hd-popmini__row' + (isSelf ? " hd-popmini__row--self" : "") + '" data-species="' + sp.id + '">' +
          '<span class="hd-popmini__dot" style="background:' + sp.color + '"></span>' +
          '<span class="hd-popmini__name' + (isSelf ? " hd-popmini__name--self" : "") + '">' +
            sp.name + (isSelf ? " · 你" : "") +
          '</span>' +
          '<span class="hd-popmini__num">' + count + '</span>' +
        '</div>';
    }
    html +=
      '<div class="hd-detail-card">' +
        '<div class="hd-popmini">' +
          '<h3 class="hd-popmini__title">族群分布</h3>' +
          '<div class="hd-popmini__rows">' + rowsHtml + '</div>' +
        '</div>' +
      '</div>';

    // 性狀
    var traitsHtml = "";
    var u = window.HD_TRAITS.unlocked;
    for (var j = 0; j < u.length; j++) {
      traitsHtml +=
        '<span class="hd-trait" data-trait-id="' + u[j].id + '">' +
          '<span class="hd-trait__dot"></span>' + u[j].name +
        '</span>';
    }
    var l = window.HD_TRAITS.locked;
    for (var k2 = 0; k2 < l.length; k2++) {
      traitsHtml +=
        '<span class="hd-trait hd-trait--locked" data-trait-id="' + l[k2].id + '" title="' + (l[k2].hint || "") + '">' +
          '<span class="hd-trait__dot"></span>' + l[k2].name +
        '</span>';
    }
    html +=
      '<div class="hd-detail-card">' +
        '<div class="hd-traits">' +
          '<span class="hd-section-label"><span>已解鎖性狀</span></span>' +
          '<div class="hd-traits__list">' + traitsHtml + '</div>' +
        '</div>' +
      '</div>';

    aside.innerHTML = html;
    return aside;
  };
})();
