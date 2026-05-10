// session.js — sessionStorage 包裝(刷新不掉,關 tab 才掉)
// 只存最小資訊:{ name, player_code }

(function () {
  var KEY = "hd:student";

  window.HD_SESSION = {
    getStudent: function () {
      try {
        var s = sessionStorage.getItem(KEY);
        return s ? JSON.parse(s) : null;
      } catch (_) {
        return null;
      }
    },
    setStudent: function (obj) {
      try {
        sessionStorage.setItem(KEY, JSON.stringify({
          name:        String(obj.name || ""),
          player_code: String(obj.player_code || ""),
        }));
      } catch (_) {
        /* sessionStorage 不可用就放棄,不影響當下這場 */
      }
    },
    clearStudent: function () {
      try { sessionStorage.removeItem(KEY); } catch (_) {}
    },
  };
})();
