/**
 * ShipTrack Embed Widget
 * Usage:
 *   <!-- Changelog widget -->
 *   <div id="shiptrack-changelog"></div>
 *   <script src="https://your-shiptrack-instance.com/embed.js" data-slug="your-product-slug" data-type="changelog"></script>
 *
 *   <!-- Feature board widget -->
 *   <div id="shiptrack-board"></div>
 *   <script src="https://your-shiptrack-instance.com/embed.js" data-slug="your-product-slug" data-type="board"></script>
 */

(function () {
  const BASE_URL = window.location.origin;
  const slug = document.currentScript?.dataset.slug;
  const type = document.currentScript?.dataset.type || "changelog";

  if (!slug) {
    console.error("[ShipTrack] data-slug is required");
    return;
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .shiptrack-widget {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 640px;
      margin: 0 auto;
      padding: 16px;
      color: #1a1a1a;
    }

    .shiptrack-widget.dark {
      color: #e5e5e5;
    }

    .shiptrack-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    .shiptrack-widget.dark .shiptrack-header {
      border-bottom-color: #333;
    }

    .shiptrack-title {
      font-size: 16px;
      font-weight: 700;
      color: inherit;
      text-decoration: none;
    }

    .shiptrack-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 999px;
      background: #f0f0f0;
      color: #666;
    }

    .shiptrack-widget.dark .shiptrack-badge {
      background: #333;
      color: #aaa;
    }

    .shiptrack-entry {
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .shiptrack-widget.dark .shiptrack-entry {
      border-bottom-color: #222;
    }

    .shiptrack-entry:last-child {
      border-bottom: none;
    }

    .shiptrack-entry-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .shiptrack-entry-title {
      font-size: 14px;
      font-weight: 600;
      color: inherit;
    }

    .shiptrack-tag {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .shiptrack-tag-feature { background: #dbeafe; color: #1d4ed8; }
    .shiptrack-tag-fix { background: #fecaca; color: #dc2626; }
    .shiptrack-tag-improvement { background: #dcfce7; color: #16a34a; }

    .shiptrack-widget.dark .shiptrack-tag-feature { background: #1e3a5f; color: #93c5fd; }
    .shiptrack-widget.dark .shiptrack-tag-fix { background: #3f1a1a; color: #fca5a5; }
    .shiptrack-widget.dark .shiptrack-tag-improvement { background: #1a3f2a; color: #86efac; }

    .shiptrack-entry-date {
      font-size: 11px;
      color: #999;
      margin-left: auto;
    }

    .shiptrack-entry-body {
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }

    .shiptrack-widget.dark .shiptrack-entry-body {
      color: #aaa;
    }

    .shiptrack-entry-body p { margin: 0 0 8px; }
    .shiptrack-entry-body p:last-child { margin-bottom: 0; }

    .shiptrack-footer {
      margin-top: 16px;
      text-align: center;
    }

    .shiptrack-view-all {
      font-size: 12px;
      color: #666;
      text-decoration: none;
      font-weight: 500;
    }

    .shiptrack-view-all:hover { text-decoration: underline; }

    .shiptrack-widget.dark .shiptrack-view-all { color: #888; }

    /* Feature board */
    .shiptrack-feature {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .shiptrack-widget.dark .shiptrack-feature { border-bottom-color: #222; }

    .shiptrack-feature:last-child { border-bottom: none; }

    .shiptrack-vote-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      min-width: 40px;
    }

    .shiptrack-vote-count {
      font-size: 13px;
      font-weight: 600;
      color: #333;
    }

    .shiptrack-widget.dark .shiptrack-vote-count { color: #ccc; }

    .shiptrack-empty {
      text-align: center;
      padding: 24px 0;
      color: #999;
      font-size: 13px;
    }

    .shiptrack-loading {
      text-align: center;
      padding: 24px 0;
      color: #999;
      font-size: 13px;
    }

    .shiptrack-error {
      text-align: center;
      padding: 24px 0;
      color: #dc2626;
      font-size: 13px;
    }

    .shiptrack-status {
      font-size: 10px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: capitalize;
    }

    .shiptrack-status-open { background: #fef9c3; color: #a16207; }
    .shiptrack-status-planned { background: #dbeafe; color: #1d4ed8; }
    .shiptrack-status-shipped { background: #dcfce7; color: #16a34a; }
    .shiptrack-status-declined { background: #f5f5f5; color: #666; }
  `;

  function detectDarkMode() {
    return (
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ||
      document.documentElement.classList.contains("dark")
    );
  }

  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function renderChangelog(container, data, dark) {
    const entries = data.entries || [];
    container.innerHTML = `
      <style>${styles}</style>
      <div class="shiptrack-widget ${dark ? "dark" : ""}">
        <div class="shiptrack-header">
          <a href="${BASE_URL}/${slug}" class="shiptrack-title">${data.productName}</a>
          <span class="shiptrack-badge">Changelog</span>
        </div>
        ${
          entries.length === 0
            ? '<div class="shiptrack-empty">No changelog entries yet.</div>'
            : entries
                .map(
                  (entry) => `
            <div class="shiptrack-entry">
              <div class="shiptrack-entry-header">
                <span class="shiptrack-entry-title">${escapeHtml(entry.title)}</span>
                <span class="shiptrack-tag shiptrack-tag-${entry.tag || "feature"}">${entry.tag || "feature"}</span>
                <span class="shiptrack-entry-date">${formatDate(entry.createdAt)}</span>
              </div>
              <div class="shiptrack-entry-body">${escapeHtml(entry.body || "").substring(0, 300)}${entry.body?.length > 300 ? "..." : ""}</div>
            </div>
          `
                )
                .join("")
        }
        <div class="shiptrack-footer">
          <a href="${BASE_URL}/${slug}" class="shiptrack-view-all">View full changelog →</a>
        </div>
      </div>
    `;
  }

  function renderBoard(container, data, dark) {
    const features = data.features || [];
    container.innerHTML = `
      <style>${styles}</style>
      <div class="shiptrack-widget ${dark ? "dark" : ""}">
        <div class="shiptrack-header">
          <a href="${BASE_URL}/${slug}/board" class="shiptrack-title">${data.productName} — Feature Board</a>
          <span class="shiptrack-badge">Ideas</span>
        </div>
        ${
          features.length === 0
            ? '<div class="shiptrack-empty">No feature requests yet. Suggest one!</div>'
            : features
                .slice(0, 10)
                .map(
                  (f) => `
            <div class="shiptrack-feature">
              <div class="shiptrack-vote-btn">
                <span class="shiptrack-vote-count">${f.votes}</span>
                <span style="font-size:10px;color:#999">votes</span>
              </div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                  <span style="font-size:14px;font-weight:500">${escapeHtml(f.title)}</span>
                  ${f.status !== "open" ? `<span class="shiptrack-status shiptrack-status-${f.status}">${f.status}</span>` : ""}
                </div>
                ${f.description ? `<div style="font-size:12px;color:#888">${escapeHtml(f.description).substring(0, 100)}</div>` : ""}
              </div>
            </div>
          `
                )
                .join("")
        }
        <div class="shiptrack-footer">
          <a href="${BASE_URL}/${slug}/board" class="shiptrack-view-all">View all & vote →</a>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function init() {
    const containerId =
      type === "board" ? "shiptrack-board" : "shiptrack-changelog";
    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`[ShipTrack] Element #${containerId} not found`);
      return;
    }

    container.innerHTML = `<div class="shiptrack-loading">Loading...</div>`;

    const dark = detectDarkMode();
    const endpoint =
      type === "board"
        ? `/api/embed/${slug}/board`
        : `/api/embed/${slug}/changelog`;

    try {
      const res = await fetch(BASE_URL + endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (type === "board") {
        renderBoard(container, data, dark);
      } else {
        renderChangelog(container, data, dark);
      }
    } catch (err) {
      container.innerHTML = `<div class="shiptrack-error">Unable to load ShipTrack widget.</div>`;
      console.error("[ShipTrack]", err);
    }
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
