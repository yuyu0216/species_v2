// icons.js — SVG 圖示集
// 用法:hdIconSvg("wetland", 18) → 回傳 SVG 字串
// 對應 reference/project/components/atoms.jsx 的 HdIcon

(function () {
  var ICONS = {
    wetland:    '<path d="M3 17c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/><path d="M7 13V7M11 13V5M15 13V8M19 13V9"/>',
    forest:     '<path d="M12 3l5 7h-3l4 6h-4l3 4H7l3-4H6l4-6H7l5-7z"/>',
    urban:      '<rect x="4" y="9" width="6" height="12" rx="1"/><rect x="14" y="5" width="6" height="16" rx="1"/><path d="M6 13h2M6 17h2M16 9h2M16 13h2M16 17h2"/>',
    port:       '<rect x="3" y="13" width="6" height="5" rx="1"/><rect x="11" y="11" width="6" height="7" rx="1"/><path d="M3 21h18M5 18v3M19 18v3"/><circle cx="20" cy="7" r="2"/>',
    forage:     '<path d="M12 21c-4-2-7-5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5-3 8-7 10z"/><path d="M9 9c1 1 2 2 3 4"/>',
    breed:      '<circle cx="9" cy="10" r="3"/><circle cx="15" cy="14" r="3"/><path d="M9 13v3M15 17v3"/>',
    migrate:    '<path d="M4 12h13M13 7l5 5-5 5"/><circle cx="20" cy="6" r="1.5"/>',
    explore:    '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    food:       '<path d="M12 4c2 0 3 2 3 4 0 1-.5 2-1 3l-1 9h-2l-1-9c-.5-1-1-2-1-3 0-2 1-4 3-4z"/>',
    water:      '<path d="M12 3c-3 5-6 9-6 13a6 6 0 0 0 12 0c0-4-3-8-6-13z"/>',
    vegetation: '<path d="M12 21V10M12 10c-4 0-7-2-7-6 4 0 7 2 7 6zM12 14c4 0 7-2 7-6-4 0-7 2-7 6z"/>',
    skull:      '<path d="M5 11a7 7 0 0 1 14 0v3l-1.5 1.5V18h-11v-2.5L5 14z"/><circle cx="9" cy="12" r="1.2"/><circle cx="15" cy="12" r="1.2"/>',
    user:       '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
    timer:      '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 3h6"/>',
    send:       '<path d="M4 12l16-7-7 16-2-7-7-2z"/>',
    sparkle:    '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    close:      '<path d="M6 6l12 12M18 6L6 18"/>',
  };

  // 回傳完整 SVG 字串
  window.hdIconSvg = function (name, size, stroke) {
    var s  = size  || 20;
    var sw = stroke || 1.6;
    var inner = ICONS[name] || '<circle cx="12" cy="12" r="9"/>';
    return (
      '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="' + sw + '" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner + '</svg>'
    );
  };

  // 環形 AP 進度(svg 字串),value/max 0..max
  window.hdRoundGaugeSvg = function (value, max) {
    var r = 18;
    var c = 2 * Math.PI * r;
    var pct = Math.max(0, Math.min(1, value / max));
    var offset = c * (1 - pct);
    return (
      '<svg width="48" height="48" viewBox="0 0 48 48" style="transform:rotate(-90deg)">' +
        '<circle cx="24" cy="24" r="' + r + '" fill="none" stroke-width="4" ' +
        'stroke="var(--hd-line)"/>' +
        '<circle cx="24" cy="24" r="' + r + '" fill="none" stroke-width="4" ' +
        'stroke="var(--hd-accent)" stroke-linecap="round" ' +
        'stroke-dasharray="' + c.toFixed(2) + '" ' +
        'stroke-dashoffset="' + offset.toFixed(2) + '" ' +
        'style="transition:stroke-dashoffset .4s ease"/>' +
      '</svg>'
    );
  };
})();
