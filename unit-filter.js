/* Shared unit filtering for the four analysis pages. */
(() => {
  "use strict";
  const unit = (new URLSearchParams(location.search).get("unit") || "").trim();
  const filteredRows = new WeakMap();
  const style = document.createElement("style");
  style.textContent = '[hidden] { display: none !important; } .unit-empty { margin: 48px 20px; text-align: center; color: #5c5c5c; font: 14px/1.8 "Microsoft YaHei", sans-serif; }';
  document.head.appendChild(style);

  // Match the owning unit column, never replace source data with the query.
  function filter(table) {
    const columns = [...table.querySelectorAll("thead th")];
    const unitColumn = columns.findIndex((cell) => cell.textContent.trim() === "单位名称");
    const rows = [...table.querySelectorAll("tbody > tr")];
    const matches = rows.filter((row) => !unit || (unitColumn >= 0 && row.cells[unitColumn]?.textContent.trim() === unit));
    const matchSet = new Set(matches);
    rows.forEach((row) => { row.hidden = !matchSet.has(row); });
    matches.forEach((row, index) => {
      row.cells[0].textContent = String(index + 1);
      row.cells[0].title = String(index + 1);
    });
    return matches;
  }

  const list = document.querySelector("[data-accordion-list]");
  const equityTable = document.querySelector(".unit-table");
  let total = 0;
  if (list) {
    list.querySelectorAll("[data-accordion-item]").forEach((item) => {
      const rows = filter(item.querySelector(".data-table"));
      filteredRows.set(item, rows);
      item.hidden = rows.length === 0;
      item.querySelector(".total").textContent = `共${rows.length}条`;
      total += rows.length;
    });
    list.hidden = total === 0;
  } else if (equityTable) {
    total = filter(equityTable).length;
    document.querySelector("main .total").textContent = `共${total}条`;
    document.querySelector("main").hidden = total === 0;
  }

  window.UnitFilter = Object.freeze({ rows: (item) => filteredRows.get(item) || [] });
  if (total === 0 && (list || equityTable)) {
    const empty = document.createElement("p");
    empty.className = "unit-empty";
    empty.setAttribute("role", "status");
    empty.textContent = unit ? `暂无数据：未找到“${unit}”的相关记录` : "暂无数据";
    document.querySelector("main").after(empty);
  }
})();
