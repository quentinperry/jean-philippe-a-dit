#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.env.PORT || "3000", 10);
const ROOT = __dirname;
const STORE = path.join(ROOT, "quotes.json");
const MAX_BODY = 64 * 1024;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function loadStore() {
  try {
    return JSON.parse(fs.readFileSync(STORE, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveStore(list) {
  fs.writeFileSync(STORE, JSON.stringify(list, null, 2) + "\n");
}

function sendJSON(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > MAX_BODY) {
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function validChapter(chapter) {
  try {
    const dataJs = fs.readFileSync(path.join(ROOT, "data.js"), "utf8");
    return new RegExp('id:\\s*"' + chapter + '"').test(dataJs);
  } catch (e) {
    return false;
  }
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function buildSource(work, year) {
  const parts = [];
  if (work) parts.push(String(work).trim());
  if (year) parts.push(String(year).trim());
  return parts.join(", ");
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/quotes") {
    if (req.method === "GET") {
      return sendJSON(res, 200, loadStore());
    }
    if (req.method === "POST") {
      try {
        const raw = await readBody(req);
        const payload = JSON.parse(raw || "{}");
        const chapter = String(payload.chapter || "");
        const text = String(payload.text || "").trim();
        const source = buildSource(payload.work, payload.year);
        if (!chapter || !validChapter(chapter)) {
          return sendJSON(res, 400, { error: "Catégorie invalide." });
        }
        if (!text) {
          return sendJSON(res, 400, { error: "La citation ne peut pas être vide." });
        }
        if (text.length > 1000) {
          return sendJSON(res, 400, { error: "Citation trop longue (1000 caractères max)." });
        }
        const quote = { id: makeId(), chapter: chapter, text: text, source: source };
        const list = loadStore();
        list.push(quote);
        saveStore(list);
        return sendJSON(res, 201, quote);
      } catch (e) {
        return sendJSON(res, e.message === "body too large" ? 413 : 400, { error: "Requête invalide." });
      }
    }
    return sendJSON(res, 405, { error: "Méthode non autorisée." });
  }

  const m = url.pathname.match(/^\/api\/quotes\/([a-z0-9]+)$/i);
  if (m && req.method === "DELETE") {
    const list = loadStore();
    const next = list.filter((q) => q.id !== m[1]);
    if (next.length === list.length) {
      return sendJSON(res, 404, { error: "Citation introuvable." });
    }
    saveStore(next);
    return sendJSON(res, 200, { ok: true });
  }

  let file = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(ROOT, file));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Interdit");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Introuvable");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log("Jean-Philippe a dit – http://localhost:" + PORT);
  });
}

module.exports = server;
