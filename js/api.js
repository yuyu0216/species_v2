// api.js — 後端 API 抽象層(Phase A:只實作 chat)
//
// 規則(節錄自 0509AIplan.md §六,所有打 GAS 的程式碼都遵守):
//   1. 每個呼叫都有觸發理由,不做保險呼叫
//   2. 同一份資料只拉一次,後續從 state 讀
//   3. Polling 用 visibility-aware(Phase A 沒 polling)
//   4. 失敗不重試,顯示錯誤讓使用者再點
//   5. Client 端先 validate,不讓 GAS 當 validator
//   6. Debounce / throttle 互動(送出後鎖按鈕)
//   7. 同筆資料合併呼叫
//   8. 能在前端算的不送後端
//
// MOCK_MODE === true 時,所有呼叫走本地 mock 不打網路

(function () {
  // ── Mock implementations ───────────────────────────────────
  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  async function mockChat(payload) {
    await delay(350);
    return {
      ok:    true,
      reply: "(MOCK)我聽到你說:" + payload.message,
    };
  }

  async function mockLogin(name, code) {
    await delay(250);
    return {
      ok:           true,
      name:         name,
      player_code:  code,
      species:      "generic",
      team:         "MOCK",
      bodyDesc:     "(MOCK)我能感覺到風的方向。",
    };
  }

  // ── 真實 GAS POST ──────────────────────────────────────────
  async function gasPost(action, payload) {
    var url = window.HD_CONFIG.GAS_URL;
    if (!url) {
      return { ok: false, error: "GAS_URL 未設定,請編輯 src/js/config.js" };
    }

    var controller = new AbortController();
    var timeout = setTimeout(
      function () { controller.abort(); },
      window.HD_CONFIG.REQUEST_TIMEOUT_MS || 15000
    );

    try {
      // Content-Type: text/plain 是必要的 — 避開 CORS preflight
      // GAS 端 doPost 仍可正常用 JSON.parse(e.postData.contents) 讀取
      var body = JSON.stringify(Object.assign({ action: action }, payload || {}));
      var res = await fetch(url, {
        method:  "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body:    body,
        signal:  controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        return { ok: false, error: "HTTP " + res.status };
      }
      var data;
      try {
        data = await res.json();
      } catch (_) {
        return { ok: false, error: "回應不是合法 JSON" };
      }
      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (err.name === "AbortError") return { ok: false, error: "timeout" };
      return { ok: false, error: err.message || "network error" };
    }
  }

  // ── 公開 API ───────────────────────────────────────────────
  window.HD_API = {
    /**
     * 驗證學生(GAS 比對 students 分頁)
     * 成功回 { ok:true, name, player_code, species, team, bodyDesc }
     * 失敗回 { ok:false, error }
     */
    login: async function (name, code) {
      var n = String(name || "").trim();
      var c = String(code || "").trim().toUpperCase();
      if (!n) return { ok: false, error: "請輸入姓名" };
      if (!c) return { ok: false, error: "請輸入玩家代號" };
      if (window.HD_CONFIG.MOCK_MODE) {
        return mockLogin(n, c);
      }
      return gasPost("login", { name: n, player_code: c });
    },

    /**
     * 送一條訊息給 AI 夥伴,回 { ok, reply } 或 { ok:false, error }
     * @param {{name:string, player_code:string, message:string, round:number}} payload
     */
    chat: async function (payload) {
      // Client-side validate(規則 5)
      if (!payload || !payload.message || !payload.message.trim()) {
        return { ok: false, error: "訊息為空" };
      }
      if (payload.message.length > 500) {
        return { ok: false, error: "訊息過長(上限 500 字)" };
      }
      if (window.HD_CONFIG.MOCK_MODE) {
        return mockChat(payload);
      }
      return gasPost("chat", {
        name:        payload.name        || "匿名",
        player_code: payload.player_code || "ANON",
        message:     payload.message,
        round:       payload.round       || 1,
      });
    },
  };
})();
