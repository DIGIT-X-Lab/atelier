/**
 * Gantt / project timeline — house recipe (work packages × time, with milestones & go/no-go gates).
 *
 * The grant timeline reviewers expect: WP bars over months, milestone diamonds, and decision
 * (go/no-go) gates as vertical rules. Reads colours from `theme.palette`; obeys the craft bar
 * (NO text overlap — labels live in clear bands, never on bars or under other text).
 *
 * Contract:  export function render({ svg, d3, theme, data })
 *   data: {
 *     months: 48,
 *     packages: [{ id:"WP1", name:"Foundations", start:0, duration:12 }, ...],
 *     milestones: [{ label:"M1", month:12, wp:"WP1" }, ...],   // optional — drawn ABOVE the WP bar
 *     gates: [{ label:"Go/No-Go", month:24 }, ...]             // optional decision points
 *   }
 *   Falls back to a built-in 4-WP demo if none supplied.
 */
export function render({ svg, d3, theme, data }) {
  const P = theme.palette;

  data = data || {
    months: 48,
    packages: [
      { id: "WP1", name: "Foundations & data", start: 0, duration: 12 },
      { id: "WP2", name: "Method development", start: 8, duration: 18 },
      { id: "WP3", name: "Validation", start: 22, duration: 16 },
      { id: "WP4", name: "Translation & dissemination", start: 34, duration: 14 },
    ],
    milestones: [
      { label: "M1", month: 12, wp: "WP1" },
      { label: "M2", month: 26, wp: "WP2" },
      { label: "M3", month: 38, wp: "WP3" },
    ],
    gates: [{ label: "Go / No-Go", month: 24 }],
  };
  const pkgs = data.packages || [];
  const months = data.months || (d3.max(pkgs, (d) => d.start + d.duration) || 12);
  const milestones = data.milestones || [];
  const gates = data.gates || [];

  // generous top for the gate-label band; left wide enough for "WPn · name" labels (truncated if huge)
  const m = { top: 96, right: 30, bottom: 52, left: 244 };
  const rowStep = 48;
  const H = m.top + pkgs.length * rowStep + m.bottom;
  const W = 760;
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
  svg.selectAll("*").remove();
  const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

  const x = d3.scaleLinear().domain([0, months]).range([0, iw]);
  const y = d3.scaleBand().domain(pkgs.map((d) => d.id)).range([0, ih]).paddingInner(0.45).paddingOuter(0.25);
  const barH = Math.min(y.bandwidth(), 20);
  const ramp = (P.accents && P.accents[0]) || P.primary;
  const fillFor = (i) => d3.interpolateHcl(P.primary, ramp)(pkgs.length > 1 ? i / (pkgs.length - 1) : 0);

  // year gridlines (every 12 months) — hairline, BEHIND everything (class "grid" so the QA gate
  // treats them as background, not a collision)
  const yearTicks = d3.range(0, months + 1, 12);
  g.selectAll("line.grid").data(yearTicks).join("line").attr("class", "grid")
    .attr("x1", (d) => x(d)).attr("x2", (d) => x(d)).attr("y1", 0).attr("y2", ih)
    .attr("stroke", P.hairline).attr("stroke-width", 1);

  // gates — dashed vertical rule + label in the clear band above the bars (below the subtitle)
  gates.forEach((gt) => {
    g.append("line").attr("class", "grid").attr("x1", x(gt.month)).attr("x2", x(gt.month))
      .attr("y1", -16).attr("y2", ih).attr("stroke", P.primary).attr("stroke-width", 1.5).attr("stroke-dasharray", "4 3");
    g.append("text").attr("x", x(gt.month)).attr("y", -22).attr("text-anchor", "middle")
      .attr("class", "annot").attr("fill", P.primary).text(gt.label);
  });

  // WP rows: left label + bar (no text on the bar)
  pkgs.forEach((p, i) => {
    const cy = y(p.id) + (y.bandwidth() - barH) / 2;
    const lbl = `${p.id} · ${p.name}`;
    const shown = lbl.length > 34 ? lbl.slice(0, 33) + "…" : lbl; // guard against frame clipping
    const lblText = g.append("text").attr("x", -14).attr("y", y(p.id) + y.bandwidth() / 2).attr("dy", "0.32em")
      .attr("text-anchor", "end").attr("class", "ax-title").attr("fill", P.ink).text(shown);
    if (shown !== lbl) lblText.append("title").text(lbl); // full name on hover when truncated
    g.append("rect").attr("x", x(p.start)).attr("y", cy)
      .attr("width", Math.max(2, x(p.start + p.duration) - x(p.start))).attr("height", barH)
      .attr("rx", 4).attr("fill", fillFor(i)).attr("fill-opacity", 0.9);
  });

  // milestones — diamond + label in the clear gap ABOVE each WP bar (never on a bar)
  milestones.forEach((ms) => {
    const row = pkgs.find((p) => p.id === ms.wp) || pkgs[0];
    if (!row) return;
    const barTop = y(row.id) + (y.bandwidth() - barH) / 2;
    const cx = x(ms.month), dy = barTop - 11, r = 4.5;
    g.append("path").attr("d", `M${cx},${dy - r} L${cx + r},${dy} L${cx},${dy + r} L${cx - r},${dy} Z`)
      .attr("fill", P.ink).attr("stroke", P.paper).attr("stroke-width", 1);
    g.append("text").attr("x", cx + r + 7).attr("y", dy).attr("dy", "0.32em")
      .attr("text-anchor", "start").attr("class", "annot").attr("fill", P.ink).text(ms.label);
  });

  // x-axis in years
  const xAxis = g.append("g").attr("transform", `translate(0,${ih})`)
    .call(d3.axisBottom(x).tickValues(yearTicks).tickFormat((d) => `${d / 12}y`).tickSize(-4).tickPadding(8));
  xAxis.select(".domain").attr("class", "ax-domain");
  xAxis.selectAll(".tick").attr("class", "ax-tick");

  // titles
  svg.append("text").attr("x", m.left).attr("y", 30).attr("class", "fig-title").text("Project timeline");
  svg.append("text").attr("x", m.left - 44).attr("y", 30).attr("class", "panel-label").text("A");
  svg.append("text").attr("x", m.left).attr("y", 50).attr("class", "annot")
    .text(`${pkgs.length} work packages · ${months} months · diamonds = milestones · dashed = decision gate`);
  g.append("text").attr("x", iw / 2).attr("y", ih + 40).attr("text-anchor", "middle")
    .attr("class", "ax-title").text("Years from project start");
}
