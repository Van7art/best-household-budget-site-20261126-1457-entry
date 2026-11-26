// Envelope Budget — all logic runs locally. No network requests.
// State is seeded from data.js and persisted to localStorage.
(function () {
  "use strict";
  var seed = window.BUDGET_SEED;
  var KEY = "envelope-budget-v1";
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.envelopes && s.transactions && s.bills) return s;
      }
    } catch (e) { /* corrupted storage: fall back to seed */ }
    return JSON.parse(JSON.stringify(seed));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  }
  function money(n) {
    var neg = n < 0;
    var v = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return (neg ? "−$" : "$") + v;
  }
  function money2(n) {
    var neg = n < 0;
    var v = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (neg ? "−$" : "$") + v;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(id) { return document.getElementById(id); }
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function envById(id) {
    for (var i = 0; i < state.envelopes.length; i++) if (state.envelopes[i].id === id) return state.envelopes[i];
    return null;
  }
  function envName(id) {
    if (id === "income") return "Income";
    if (id === "other") return "Other";
    var e = envById(id);
    return e ? e.name : id;
  }
  function totals() {
    var assigned = 0, spent = 0;
    state.envelopes.forEach(function (e) { assigned += e.assigned; spent += e.spent; });
    var otherSpent = 0;
    state.transactions.forEach(function (t) { if (t.amount < 0 && !envById(t.env)) otherSpent += -t.amount; });
    return {
      income: state.income,
      assigned: assigned,
      envSpent: spent,
      spent: spent + otherSpent,
      left: state.income - assigned - state.savingsGoal,
      savings: state.savingsGoal
    };
  }
  function pct(spent, assigned) {
    if (!assigned) return 0;
    return Math.min(100, Math.round(spent / assigned * 100));
  }

  /* ---------------- routing ---------------- */
  var ROUTES = ["dashboard", "envelopes", "transactions", "planner", "bills", "reports"];
  function currentRoute() {
    var r = (location.hash || "#/dashboard").replace("#/", "").split("?")[0];
    return ROUTES.indexOf(r) === -1 ? "dashboard" : r;
  }
  function render() {
    var r = currentRoute();
    document.querySelectorAll(".page").forEach(function (p) { p.classList.remove("active"); });
    var page = $("page-" + r);
    if (page) page.classList.add("active");
    document.querySelectorAll("nav.main a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#/" + r);
    });
    if (r === "dashboard") renderDashboard();
    if (r === "envelopes") renderEnvelopes();
    if (r === "transactions") renderTransactions();
    if (r === "planner") renderPlanner();
    if (r === "bills") renderBills();
    if (r === "reports") renderReports();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);

  /* ---------------- dashboard ---------------- */
  function renderDashboard() {
    var t = totals();
    $("d-income").textContent = money(t.income);
    $("d-assigned").textContent = money(t.assigned + t.savings);
    $("d-spent").textContent = money(t.spent);
    $("d-left").textContent = money(t.left);
    $("d-left-sub").textContent = t.left >= 0 ? "Give every dollar a job" : "Over-assigned — move money around";
    $("d-hero-left").textContent = money(t.left);
    $("d-hero-note").textContent = "of " + money(t.income) + " income · " + money(t.assigned + t.savings) +
      " assigned · " + money(t.spent) + " spent so far";
    $("d-assign-bar").style.width = Math.min(100, Math.round((t.assigned + t.savings) / t.income * 100)) + "%";

    var envHtml = state.envelopes.map(function (e) {
      var left = e.assigned - e.spent;
      var p = pct(e.spent, e.assigned);
      return '<div class="chart-label"><span>' + esc(e.name) + '</span><b>' + money(e.spent) + ' of ' +
        money(e.assigned) + ' · ' + money(left) + ' left</b></div>' +
        '<div class="fill"><i style="width:' + p + '%;background:' + (left < 0 ? 'var(--red)' : e.color) + '"></i></div>';
    }).join("");
    $("d-env-overview").innerHTML = envHtml;

    var upcoming = state.bills.filter(function (b) { return !b.paid; })
      .sort(function (a, b) { return a.due < b.due ? -1 : 1; }).slice(0, 4);
    $("d-bills").innerHTML = upcoming.length ? upcoming.map(function (b) {
      return '<li><span>' + esc(b.name) + '<small>Due ' + b.due + (b.autopay ? ' · Autopay on' : '') + '</small></span><b class="money">' + money2(b.amount) + '</b></li>';
    }).join("") : '<li><span>All bills paid for November. Nice work!</span></li>';

    var recent = state.transactions.slice().sort(function (a, b) { return b.date < a.date ? -1 : 1; }).slice(0, 6);
    $("d-activity").innerHTML = recent.map(function (tr) {
      return '<li><span>' + esc(tr.desc) + '<small>' + tr.date + ' · ' + esc(envName(tr.env)) + '</small></span>' +
        '<b class="' + (tr.amount < 0 ? 'neg' : 'pos') + '">' + (tr.amount < 0 ? '−' : '+') + money2(Math.abs(tr.amount)) + '</b></li>';
    }).join("");
  }

  /* ---------------- envelopes ---------------- */
  function renderEnvelopes() {
    $("env-grid").innerHTML = state.envelopes.map(function (e) {
      var left = e.assigned - e.spent;
      var p = pct(e.spent, e.assigned);
      var over = left < 0;
      return '<article class="env' + (over ? ' over' : '') + '">' +
        '<div class="env-top"><div class="env-icon" style="background:' + e.color + '">' + esc(e.icon) + '</div>' +
        '<div><h3>' + esc(e.name) + '</h3><p class="note">' + esc(e.note) + '</p></div>' +
        '<span class="badge' + (over ? ' over' : '') + '" style="margin-left:auto">' + (over ? 'OVER SPENT' : p >= 100 ? 'FULLY SPENT' : p + '% used') + '</span></div>' +
        '<div class="env-nums"><div><small>Assigned</small><b>' + money(e.assigned) + '</b></div>' +
        '<div><small>Spent</small><b>' + money(e.spent) + '</b></div>' +
        '<div class="left"><small>Remaining</small><b>' + money(left) + '</b></div></div>' +
        '<div class="fill"><i style="width:' + p + '%;background:' + (over ? 'var(--red)' : e.color) + '"></i></div>' +
        '<div class="env-actions">' +
        '<button class="small amber" data-fund="' + e.id + '">+ Fund $25</button>' +
        '<button class="small ghost" data-adjust="' + e.id + '">Adjust assigned</button>' +
        (over ? '<button class="small danger" data-cover="' + e.id + '">Cover overspend</button>' : '') +
        '</div></article>';
    }).join("");
    var t = totals();
    $("env-summary").textContent = "Assigned " + money(t.assigned) + " across 8 envelopes · spent " +
      money(t.envSpent) + " · " + money(t.assigned - t.envSpent) + " still in envelopes";
  }
  document.addEventListener("click", function (ev) {
    var fund = ev.target.closest("[data-fund]");
    var adj = ev.target.closest("[data-adjust]");
    var cover = ev.target.closest("[data-cover]");
    var del = ev.target.closest("[data-del-tx]");
    var paid = ev.target.closest("[data-pay-bill]");
    var auto = ev.target.closest("[data-autopay]");
    if (fund) {
      var e = envById(fund.getAttribute("data-fund"));
      e.assigned += 25; save(); renderEnvelopes(); toast(e.name + " funded with $25");
    }
    if (adj) {
      var e2 = envById(adj.getAttribute("data-adjust"));
      var val = prompt("New assigned amount for " + e2.name + " (currently " + money(e2.assigned) + "):", String(e2.assigned));
      if (val !== null) {
        var n = Math.round(Number(val));
        if (isFinite(n) && n >= 0) { e2.assigned = n; save(); renderEnvelopes(); toast(e2.name + " set to " + money(n)); }
        else toast("Please enter a whole dollar amount");
      }
    }
    if (cover) {
      var e3 = envById(cover.getAttribute("data-cover"));
      var over = e3.spent - e3.assigned;
      var fun = envById("fun");
      if (fun && fun.assigned - fun.spent >= over) {
        fun.assigned -= over; e3.assigned += over; save(); renderEnvelopes();
        toast("Covered " + money(over) + " overspend from Fun Money");
      } else toast("Not enough left in Fun Money — adjust an envelope instead");
    }
    if (del) {
      var id = Number(del.getAttribute("data-del-tx"));
      var idx = -1;
      state.transactions.forEach(function (tr, i) { if (tr.id === id) idx = i; });
      if (idx > -1) {
        var tr = state.transactions[idx];
        var env = envById(tr.env);
        if (env && tr.amount < 0) env.spent = Math.max(0, env.spent + tr.amount);
        state.transactions.splice(idx, 1);
        save(); renderTransactions(); toast("Transaction deleted");
      }
    }
    if (paid) {
      var b = null;
      state.bills.forEach(function (x) { if (x.id === paid.getAttribute("data-pay-bill")) b = x; });
      if (b) { b.paid = !b.paid; save(); renderBills(); toast(b.paid ? b.name + " marked paid" : b.name + " marked unpaid"); }
    }
    if (auto) {
      var b2 = null;
      state.bills.forEach(function (x) { if (x.id === auto.getAttribute("data-autopay")) b2 = x; });
      if (b2) { b2.autopay = !b2.autopay; save(); renderBills(); }
    }
  });

  /* ---------------- transactions ---------------- */
  var txFilter = "all", txSearch = "";
  function renderTransactions() {
    var rows = state.transactions.slice().sort(function (a, b) { return b.date < a.date ? -1 : 1; });
    if (txFilter !== "all") rows = rows.filter(function (t) { return t.env === txFilter; });
    if (txSearch) {
      var q = txSearch.toLowerCase();
      rows = rows.filter(function (t) { return t.desc.toLowerCase().indexOf(q) !== -1; });
    }
    var sel = $("tx-filter");
    if (sel.options.length <= 1) {
      state.envelopes.forEach(function (e) {
        var o = document.createElement("option"); o.value = e.id; o.textContent = e.name; sel.appendChild(o);
      });
    }
    sel.value = txFilter;
    $("tx-body").innerHTML = rows.length ? rows.map(function (tr) {
      return '<tr><td>' + tr.date + '</td><td>' + esc(tr.desc) + '</td><td>' + esc(envName(tr.env)) + '</td>' +
        '<td class="num"><span class="' + (tr.amount < 0 ? 'neg' : 'pos') + '">' + (tr.amount < 0 ? '−' : '+') +
        money2(Math.abs(tr.amount)) + '</span></td>' +
        '<td><button class="small danger" data-del-tx="' + tr.id + '">Delete</button></td></tr>';
    }).join("") : '<tr><td colspan="5">No transactions match. Try clearing the search or filter.</td></tr>';
    var spent = 0, income = 0;
    state.transactions.forEach(function (t) { if (t.amount < 0) spent += -t.amount; else income += t.amount; });
    $("tx-count").textContent = rows.length + " of " + state.transactions.length + " transactions · " +
      money(income) + " in · " + money(spent) + " out";
  }
  function bindTransactions() {
    $("tx-filter").addEventListener("change", function (e) { txFilter = e.target.value; renderTransactions(); });
    $("tx-search").addEventListener("input", function (e) { txSearch = e.target.value; renderTransactions(); });
    $("tx-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var desc = $("tx-desc").value.trim();
      var amt = Math.round(Number($("tx-amount").value) * 100) / 100;
      var env = $("tx-env").value;
      var date = $("tx-date").value || "2026-11-26";
      if (!desc || !isFinite(amt) || amt === 0) { toast("Add a description and a non-zero amount"); return; }
      var id = Math.max.apply(null, state.transactions.map(function (t) { return t.id; })) + 1;
      var tr = { id: id, date: date, desc: desc, env: env, amount: -Math.abs(amt) };
      state.transactions.push(tr);
      var target = envById(env);
      if (target) target.spent += Math.abs(amt);
      save(); renderTransactions();
      $("tx-form").reset(); $("tx-date").value = "2026-11-26";
      toast("Added " + desc + " — " + money(Math.abs(amt)) + " from " + envName(env));
    });
    var sel = $("tx-env");
    state.envelopes.forEach(function (e) {
      var o = document.createElement("option"); o.value = e.id; o.textContent = e.name; sel.appendChild(o);
    });
    $("tx-date").value = "2026-11-26";
  }

  /* ---------------- planner ---------------- */
  var plan = { income: 5850, needs: 50, wants: 30, savings: 20 };
  function renderPlanner() {
    var inc = plan.income;
    var needsAmt = Math.round(inc * plan.needs / 100);
    var wantsAmt = Math.round(inc * plan.wants / 100);
    var saveAmt = inc - needsAmt - wantsAmt;
    $("pl-income").value = inc;
    $("pl-needs").value = plan.needs; $("pl-wants").value = plan.wants; $("pl-savings").value = plan.savings;
    $("pl-needs-out").textContent = plan.needs + "%";
    $("pl-wants-out").textContent = plan.wants + "%";
    $("pl-savings-out").textContent = plan.savings + "%";
    $("pl-needs-amt").textContent = money(needsAmt);
    $("pl-wants-amt").textContent = money(wantsAmt);
    $("pl-savings-amt").textContent = money(saveAmt);
    $("pl-total").textContent = "Needs " + money(needsAmt) + " · Wants " + money(wantsAmt) + " · Savings " + money(saveAmt) +
      " = " + money(inc) + " / month";
    $("pl-bar-needs").style.width = plan.needs + "%";
    $("pl-bar-wants").style.width = plan.wants + "%";
    $("pl-bar-savings").style.width = plan.savings + "%";

    var needsActual = ["rent", "groceries", "transport", "utilities", "household"]
      .reduce(function (s, id) { var e = envById(id); return s + (e ? e.assigned : 0); }, 0);
    var wantsActual = ["dining", "fun", "clothing"]
      .reduce(function (s, id) { var e = envById(id); return s + (e ? e.assigned : 0); }, 0);
    var saveActual = state.savingsGoal;
    function cmp(id, target, actual) {
      var tPct = inc ? Math.round(target / inc * 100) : 0;
      var aPct = inc ? Math.round(actual / inc * 100) : 0;
      var diff = actual - target;
      $(id).innerHTML = '<b>' + money(actual) + ' (' + aPct + '%)</b><br><span class="muted">target ' + money(target) +
        ' (' + tPct + '%) — ' + (diff >= 0 ? money(diff) + ' over' : money(-diff) + ' under') + '</span>';
    }
    cmp("cmp-needs", needsAmt, needsActual);
    cmp("cmp-wants", wantsAmt, wantsActual);
    cmp("cmp-savings", saveAmt, saveActual);
    $("pl-advice").textContent = needsActual > needsAmt
      ? "Needs are running " + money(needsActual - needsAmt) + " over target — rent is the big one. Wants are well under target, so the family has room to save more."
      : "Your envelopes fit the plan. Needs are inside target — keep the difference in savings.";
  }
  function bindPlanner() {
    $("pl-income").addEventListener("input", function (e) {
      var v = Math.round(Number(e.target.value));
      if (isFinite(v) && v > 0) { plan.income = v; renderPlanner(); }
    });
    function bindSlider(id, key, other) {
      $(id).addEventListener("input", function (e) {
        var v = Number(e.target.value);
        plan[key] = v;
        var rest = 100 - v;
        plan[other] = Math.round(rest / 2);
        plan.savings = 100 - plan.needs - plan.wants;
        if (plan.savings < 0) { plan.savings = 0; plan.wants = 100 - plan.needs; }
        renderPlanner();
      });
    }
    bindSlider("pl-needs", "needs", "wants");
    bindSlider("pl-wants", "wants", "needs");
    bindSlider("pl-savings", "savings", "needs");
    $("pl-apply").addEventListener("click", function () {
      var inc = plan.income;
      var needsAmt = Math.round(inc * plan.needs / 100);
      var wantsAmt = Math.round(inc * plan.wants / 100);
      var saveAmt = inc - needsAmt - wantsAmt;
      state.income = inc;
      state.savingsGoal = saveAmt;
      // Scale the needs envelopes proportionally to the new needs target.
      var needsIds = ["rent", "groceries", "transport", "utilities", "household"];
      var cur = needsIds.reduce(function (s, id) { return s + envById(id).assigned; }, 0);
      needsIds.forEach(function (id) {
        var e = envById(id);
        e.assigned = Math.max(0, Math.round(e.assigned / cur * needsAmt));
      });
      var wantsIds = ["dining", "fun", "clothing"];
      var curW = wantsIds.reduce(function (s, id) { return s + envById(id).assigned; }, 0);
      wantsIds.forEach(function (id) {
        var e = envById(id);
        e.assigned = Math.max(0, Math.round(e.assigned / curW * wantsAmt));
      });
      save(); renderPlanner();
      toast("Plan applied — envelopes updated to " + plan.needs + "/" + plan.wants + "/" + plan.savings);
    });
    $("pl-reset").addEventListener("click", function () {
      plan = { income: 5850, needs: 50, wants: 30, savings: 20 };
      renderPlanner(); toast("Planner reset to 50 / 30 / 20");
    });
  }

  /* ---------------- bills ---------------- */
  function renderBills() {
    var nov = state.bills.filter(function (b) { return b.due.indexOf("2026-11") === 0; });
    var dec = state.bills.filter(function (b) { return b.due.indexOf("2026-12") === 0; });
    function billHtml(b) {
      var d = new Date(b.due + "T12:00:00");
      var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return '<div class="bill"><div class="when"><b>' + d.getDate() + '</b><span>' + months[d.getMonth()] + '</span></div>' +
        '<div class="info"><b>' + esc(b.name) + '</b><small>' + esc(b.cat) + ' · due ' + b.due + '</small></div>' +
        '<b class="money">' + money2(b.amount) + '</b>' +
        '<label class="switch"><input type="checkbox" data-autopay="' + b.id + '"' + (b.autopay ? ' checked' : '') + '> Autopay</label>' +
        (b.paid ? '<span class="badge paid">PAID</span><button class="small ghost" data-pay-bill="' + b.id + '">Undo</button>'
                : '<button class="small amber" data-pay-bill="' + b.id + '">Mark paid</button>') +
        '</div>';
    }
    $("bills-nov").innerHTML = nov.map(billHtml).join("");
    $("bills-dec").innerHTML = dec.map(billHtml).join("");
    var unpaid = state.bills.filter(function (b) { return !b.paid; });
    var dueSoon = unpaid.reduce(function (s, b) { return s + b.amount; }, 0);
    $("bills-summary").textContent = unpaid.length + " bills unpaid · " + money(dueSoon) +
      " still to pay · " + state.bills.filter(function (b) { return b.paid; }).length + " of " + state.bills.length + " paid";
  }

  /* ---------------- reports ---------------- */
  function renderReports() {
    var max = Math.max.apply(null, state.envelopes.map(function (e) { return e.spent; }));
    var bars = state.envelopes.map(function (e, i) {
      var w = max ? Math.round(e.spent / max * 440) : 0;
      var y = 14 + i * 34;
      return '<text x="0" y="' + (y + 11) + '" font-size="13" fill="#14213d">' + esc(e.name) + '</text>' +
        '<rect x="110" y="' + y + '" width="' + w + '" height="18" rx="4" fill="' + e.color + '"/>' +
        '<text x="' + (118 + w) + '" y="' + (y + 13) + '" font-size="12" fill="#5b6b82">' + money(e.spent) + '</text>';
    }).join("");
    $("rep-bars").innerHTML = '<svg viewBox="0 0 640 ' + (14 + state.envelopes.length * 34) + '" width="100%" role="img" aria-label="Spending by envelope bar chart">' + bars + '</svg>';

    var t = state.trend;
    var tmax = 6000;
    function pt(i, v) { return (70 + i * 240) + "," + (150 - v / tmax * 130); }
    var line = t.map(function (m, i) { return pt(i, m.spent); }).join(" ");
    var dots = t.map(function (m, i) {
      return '<circle cx="' + (70 + i * 240) + '" cy="' + (150 - m.spent / tmax * 130) + '" r="6" fill="#f4a259" stroke="#fff" stroke-width="2"/>' +
        '<text x="' + (70 + i * 240) + '" y="175" font-size="13" text-anchor="middle" fill="#5b6b82">' + m.month + '</text>' +
        '<text x="' + (70 + i * 240) + '" y="' + (130 - m.spent / tmax * 130) + '" font-size="13" text-anchor="middle" fill="#14213d" font-weight="bold">' + money(m.spent) + '</text>';
    }).join("");
    $("rep-trend").innerHTML = '<svg viewBox="0 0 560 190" width="100%" role="img" aria-label="Month over month spending trend">' +
      '<line x1="40" y1="150" x2="540" y2="150" stroke="#e3e8f0" stroke-width="2"/>' +
      '<polyline points="' + line + '" fill="none" stroke="#14213d" stroke-width="3" stroke-linejoin="round"/>' + dots + '</svg>';

    var tot = totals();
    $("rep-rollover").innerHTML = state.rollover.map(function (r) {
      return '<li><span>' + esc(r.env) + '<small>' + esc(r.note) + '</small></span><b class="' + (r.amount < 0 ? 'neg' : 'pos') + '">' +
        (r.amount < 0 ? '−' : '+') + money2(Math.abs(r.amount)) + '</b></li>';
    }).join("");
    $("rep-summary").textContent = "November: " + money(tot.spent) + " spent of " + money(tot.income) +
      " income. Spending is up " + money(tot.spent - 4120) + " on October, mostly Dining Out. " +
      money(state.rollover.filter(function (r) { return r.amount > 0; }).reduce(function (s, r) { return s + r.amount; }, 0)) +
      " rolls into December from envelopes that came in under budget.";
  }

  /* ---------------- init ---------------- */
  bindTransactions();
  bindPlanner();
  $("reset-demo").addEventListener("click", function () {
    if (confirm("Reset all data back to the November demo? Your edits will be lost.")) {
      localStorage.removeItem(KEY);
      state = JSON.parse(JSON.stringify(seed));
      render(); toast("Demo data reset");
    }
  });
  render();
})();
