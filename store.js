// Stockage des citations ajoutées par les visiteurs.
// Trois modes, essayés dans cet ordre :
//  1. "supabase" : recueil partagé hébergé (config.js renseigné) — visible par tous ;
//  2. "server"   : serveur Node local (node server.js) — visible par tous ses utilisateurs ;
//  3. "local"    : stockage du navigateur — visible uniquement sur cet appareil.
(function () {
  var LOCAL_KEY = "jp-adit-custom-quotes";   // citations stockées localement
  var OWNED_KEY = "jp-adit-owned-quotes";    // { id: jeton de suppression } des citations partagées ajoutées ici

  var cfg = window.JP_CONFIG || {};
  var sbUrl = (cfg.supabaseUrl || "").replace(/\/+$/, "");
  var sbKey = cfg.supabaseKey || "";

  var store = {
    mode: "local",
    unreachable: false, // un recueil partagé est configuré mais n'a pas répondu
    migrated: 0
  };
  var remote = [];

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function buildSource(work, year) {
    return [work, year].map(function (s) { return (s || "").trim(); }).filter(Boolean).join(", ");
  }

  // ── Supabase (API REST, sans dépendance) ─────────────────────────
  function sb(path, opts) {
    opts = opts || {};
    var headers = { apikey: sbKey, "Content-Type": "application/json" };
    if (opts.prefer) headers.Prefer = opts.prefer;
    return fetch(sbUrl + "/rest/v1/" + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (!r.ok) {
        return r.text().then(function (t) {
          var msg = "Erreur du recueil partagé (" + r.status + ")";
          try { var j = JSON.parse(t); if (j.message) msg += " : " + j.message; } catch (e) {}
          throw new Error(msg);
        });
      }
      return r.status === 204 ? null : r.text().then(function (t) { return t ? JSON.parse(t) : null; });
    });
  }

  function sbInsert(q) {
    var token = uuid();
    var row = { id: uuid(), chapter: q.chapter, text: q.text, source: q.source || "", delete_token: token };
    return sb("quotes", { method: "POST", body: row, prefer: "return=minimal" }).then(function () {
      var owned = readJSON(OWNED_KEY, {});
      owned[row.id] = token;
      writeJSON(OWNED_KEY, owned);
    });
  }

  // Les citations saisies hors ligne (mode local) rejoignent le recueil partagé
  // dès qu'il est joignable, puis disparaissent du stockage local.
  function migrateLocal() {
    var local = readJSON(LOCAL_KEY, []);
    if (!local.length) return Promise.resolve();
    var left = local.slice();
    return local.reduce(function (p, q) {
      return p.then(function () {
        return sbInsert(q).then(function () {
          left = left.filter(function (x) { return x !== q; });
          store.migrated++;
        });
      });
    }, Promise.resolve()).catch(function () {}).then(function () {
      writeJSON(LOCAL_KEY, left);
    });
  }

  function loadSupabase() {
    return sb("quotes?select=id,chapter,text,source,created_at&order=created_at.asc").then(function (rows) {
      remote = Array.isArray(rows) ? rows : [];
      store.mode = "supabase";
    });
  }

  // ── Serveur Node (server.js) ─────────────────────────────────────
  function loadServer() {
    return fetch("/api/quotes").then(function (r) {
      if (!r.ok) throw new Error("api");
      return r.json();
    }).then(function (list) {
      if (!Array.isArray(list)) throw new Error("api");
      remote = list;
      store.mode = "server";
    });
  }

  // ── API publique ─────────────────────────────────────────────────
  store.shared = function () { return store.mode !== "local"; };

  store.load = function () {
    store.unreachable = false;
    if (sbUrl && sbKey) {
      return loadSupabase()
        .then(function () {
          var before = store.migrated;
          return migrateLocal().then(function () { if (store.migrated > before) return loadSupabase(); });
        })
        .catch(function () { store.unreachable = true; store.mode = "local"; remote = []; });
    }
    return loadServer().catch(function () { store.mode = "local"; remote = []; });
  };

  store.list = function () {
    var owned = readJSON(OWNED_KEY, {});
    var shared = remote.map(function (c) {
      return {
        id: c.id, chapter: c.chapter, text: c.text, source: c.source, custom: true,
        // Supabase : seul l'appareil qui a ajouté la citation peut la supprimer.
        canDelete: store.mode === "server" || !!owned[c.id]
      };
    });
    var local = readJSON(LOCAL_KEY, []).map(function (c) {
      return { id: c.id, chapter: c.chapter, text: c.text, source: c.source, custom: true, local: true, canDelete: true };
    });
    return shared.concat(local);
  };

  store.add = function (input) {
    var q = { chapter: input.chapter, text: input.text.trim(), source: buildSource(input.work, input.year) };
    if (store.mode === "supabase") return sbInsert(q).then(loadSupabase);
    if (store.mode === "server") {
      return fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter: q.chapter, text: q.text, work: input.work, year: input.year })
      }).then(function (r) {
        if (!r.ok) return r.json().then(function (b) { throw new Error(b.error || "Erreur serveur"); });
      }).then(loadServer);
    }
    var list = readJSON(LOCAL_KEY, []);
    list.push({ id: uuid(), chapter: q.chapter, text: q.text, source: q.source });
    writeJSON(LOCAL_KEY, list);
    return Promise.resolve();
  };

  store.remove = function (id, isLocal) {
    if (isLocal) {
      writeJSON(LOCAL_KEY, readJSON(LOCAL_KEY, []).filter(function (c) { return c.id !== id; }));
      return Promise.resolve();
    }
    if (store.mode === "supabase") {
      var owned = readJSON(OWNED_KEY, {});
      return sb("rpc/delete_quote", { method: "POST", body: { quote_id: id, token: owned[id] } }).then(function (ok) {
        if (ok !== true) throw new Error("Suppression refusée");
        delete owned[id];
        writeJSON(OWNED_KEY, owned);
        return loadSupabase();
      });
    }
    return fetch("/api/quotes/" + encodeURIComponent(id), { method: "DELETE" }).then(function (r) {
      if (!r.ok) throw new Error("Suppression impossible");
    }).then(loadServer);
  };

  window.QuoteStore = store;
})();
