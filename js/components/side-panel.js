// side-panel.js — 底列左右兩張卡的內容
// hdRenderHabitatDetail:選中棲地的「總覽 + 食物/水/植被資源 + 族群分佈(2 欄,不標註你)」
// hdRenderMyStatus    :我的狀態(數量/糧食/適應)+ 已解鎖性狀

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

  function currentHabitat(state) {
    var h = window.HD_HABITATS.find(function (x) { return x.id === state.habitatId; });
    return h || window.HD_HABITATS[0];
  }

  // ── 底列第一張:棲地詳情 + 族群分佈(2 欄) ──
  window.hdRenderHabitatDetail = function (state) {
    var habitat = currentHabitat(state);
    var total = 0;
    for (var k in habitat.populations) total += habitat.populations[k];

    // 族群分佈:依數量排序,過濾掉 0 隻的;不再標註「· 你」
    var popRows = window.HD_SPECIES
      .map(function (sp) { return { sp: sp, count: habitat.populations[sp.id] || 0 }; })
      .filter(function (r) { return r.count > 0; })
      .sort(function (a, b) { return b.count - a.count; });

    var rowsHtml = "";
    for (var i = 0; i < popRows.length; i++) {
      var sp = popRows[i].sp;
      var count = popRows[i].count;
      rowsHtml +=
        '<div class="hd-popmini__row" data-species="' + sp.id + '">' +
          '<span class="hd-popmini__dot" style="background:' + sp.color + '"></span>' +
          '<span class="hd-popmini__name">' + sp.name + '</span>' +
          '<span class="hd-popmini__num">' + count + '</span>' +
        '</div>';
    }

    var section = document.createElement("section");
    section.className = "hd-card hd-detail";
    section.style.setProperty("--hd-habitat-color", habitat.themeColor);

    section.innerHTML =
      '<div class="hd-detail__head">' +
        '<div class="hd-detail__icon">' + window.hdIconSvg(habitat.id, 22) + '</div>' +
        '<div>' +
          '<div class="hd-detail__name">' + habitat.name + '</div>' +
          '<div class="hd-detail__capacity">已承載 <strong>' + total + '</strong> / ' + habitat.capacity + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="hd-resources">' +
        renderResource("food",       "食物", habitat.resources.food) +
        renderResource("water",      "水源", habitat.resources.water) +
        renderResource("vegetation", "植被", habitat.resources.vegetation) +
      '</div>' +
      '<div class="hd-popmini">' +
        '<h3 class="hd-popmini__title">族群分佈</h3>' +
        '<div class="hd-popmini__rows hd-popmini__rows--2col">' + rowsHtml + '</div>' +
      '</div>';

    return section;
  };

  // ── 底列第二張:我的狀態(數量/糧食/適應) + 已解鎖性狀 ──
  window.hdRenderMyStatus = function (state) {
    var habitat = currentHabitat(state);
    var myCount = (habitat.populations && habitat.populations[state.species]) || 0;
    var food = state.playerFood != null ? state.playerFood : 0;
    var adapt = state.playerAdaptation || "—";

    // 性狀(只顯示已解鎖)
    var u = window.HD_TRAITS.unlocked;
    var traitsHtml = "";
    for (var j = 0; j < u.length; j++) {
      traitsHtml +=
        '<span class="hd-trait" data-trait-id="' + u[j].id + '">' +
          '<span class="hd-trait__dot"></span>' + u[j].name +
        '</span>';
    }
    if (!u.length) {
      traitsHtml = '<span class="hd-trait hd-trait--empty">尚未解鎖任何性狀</span>';
    }

    var section = document.createElement("section");
    section.className = "hd-card hd-mystatus";
    section.innerHTML =
      '<h3 class="hd-section-title">我的狀態</h3>' +
      '<div class="hd-mystatus__rows">' +
        '<div class="hd-mystatus__row">' +
          '<span class="hd-mystatus__lbl">數量</span>' +
          '<span class="hd-mystatus__val">' + myCount + '</span>' +
        '</div>' +
        '<div class="hd-mystatus__row">' +
          '<span class="hd-mystatus__lbl">糧食</span>' +
          '<span class="hd-mystatus__val">' + food + '</span>' +
        '</div>' +
        '<div class="hd-mystatus__row">' +
          '<span class="hd-mystatus__lbl">適應</span>' +
          '<span class="hd-mystatus__val hd-mystatus__val--text">' + adapt + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="hd-traits__divider">' +
        '<div class="hd-section-label">已解鎖性狀</div>' +
        '<div class="hd-traits__list">' + traitsHtml + '</div>' +
      '</div>';

    return section;
  };
})();
