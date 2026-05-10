// habitat-map.js — 中央 2×2 棲地大地圖
// 地圖底圖由 CSS 切 map.png 四象限,JS 負責疊上族群 pin

(function () {
  // 給定 seed + count,回傳穩定隨機的 (x%, y%) 點位
  function seededPositions(seed, count, padding) {
    padding = padding == null ? 14 : padding;
    var s = 0;
    for (var i = 0; i < seed.length; i++) {
      s = (s * 31 + seed.charCodeAt(i)) >>> 0;
    }
    function rand() {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var pts = [];
    for (var k = 0; k < count; k++) {
      pts.push({
        x: padding + rand() * (100 - padding * 2),
        y: padding + rand() * (100 - padding * 2),
      });
    }
    return pts;
  }

  function renderTile(habitat, active, playerSpecies, onSelect) {
    var tile = document.createElement("div");
    tile.className = "hd-tile hd-tile--" + habitat.id + (active ? " hd-tile--active" : "");
    tile.setAttribute("data-habitat-id", habitat.id);

    // nametag
    var nametag = document.createElement("div");
    nametag.className = "hd-tile__nametag";
    nametag.innerHTML =
      window.hdIconSvg(habitat.id, 14) +
      escapeHtml(habitat.name) +
      '<span class="hd-tile__nametag-en">' + escapeHtml(habitat.enName) + '</span>';
    tile.appendChild(nametag);

    // 族群 pin 圖層
    var layer = document.createElement("div");
    layer.className = "hd-tile__species-layer";

    var species = window.HD_SPECIES;
    for (var i = 0; i < species.length; i++) {
      var sp = species[i];
      var count = habitat.populations[sp.id] || 0;
      if (count <= 0) continue;
      var pinCount = Math.ceil(count / 10); // 每 10 隻 1 顆 pin
      var positions = seededPositions(habitat.id + "-" + sp.id, pinCount);
      for (var j = 0; j < positions.length; j++) {
        var p = positions[j];
        var size = 9 + Math.min(7, count / 12);
        var isSelf = sp.id === playerSpecies;
        var pin = document.createElement("span");
        pin.className = "hd-species-pin" + (isSelf ? " hd-species-pin--self" : "");
        pin.setAttribute("data-species", sp.id);
        pin.style.left = p.x + "%";
        pin.style.top  = p.y + "%";
        pin.style.width  = size + "px";
        pin.style.height = size + "px";
        pin.style.background = sp.color;
        pin.title = sp.name;
        layer.appendChild(pin);
      }
    }
    tile.appendChild(layer);

    // 玩家自己族群數量(左下)
    var ownPop = habitat.populations[playerSpecies] || 0;
    if (ownPop > 0) {
      var own = document.createElement("div");
      own.className = "hd-tile__own";
      var selfSpecies = species.find(function (s) { return s.id === playerSpecies; });
      var color = selfSpecies ? selfSpecies.color : "var(--hd-ink)";
      own.innerHTML =
        '<span class="hd-tile__own-dot" style="background:' + color + '"></span>' +
        '你 · <span class="hd-tile__own-num">' + ownPop + '</span> 隻';
      tile.appendChild(own);
    }

    tile.addEventListener("click", function () { onSelect(habitat.id); });
    return tile;
  }

  window.hdRenderHabitatMap = function (state) {
    var map = document.createElement("div");
    map.className = "hd-map";

    // 排列順序對應 image.png 四象限:左上濕地 / 右上森林 / 左下都會 / 右下港口
    var order = ["wetland", "forest", "urban", "port"];
    for (var i = 0; i < order.length; i++) {
      var id = order[i];
      var h = window.HD_HABITATS.find(function (x) { return x.id === id; });
      if (!h) continue;
      map.appendChild(renderTile(
        h,
        id === state.habitatId,
        state.species,
        function (selectedId) {
          window.HD_STATE.set({ habitatId: selectedId });
        }
      ));
    }
    return map;
  };

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
