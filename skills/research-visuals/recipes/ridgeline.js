/**
 * Ridgeline — house recipe (distribution across many ordered categories).
 *
 * Stacked kernel-density curves, one row per category, ordered by median. Reveals how a
 * distribution shifts across groups in little space — honest about spread and modality where a
 * bar-of-means would hide them.
 *
 * Contract:  export function render({ svg, d3, theme, data })
 *   data: [{ region: <category>, value: <number> }, ...]
 *   colors from theme.palette; obeys the craft bar (no overlap of labels, breathing room, direct labels).
 */
export function render({ svg, d3, theme, data }) {
  const P = theme.palette;
  if (!data || !data.length) {
    svg.append("text").attr("x", 24).attr("y", 40).attr("class", "annot").text("No data — pass ?data=<file.json>");
    return;
  }

  // group + order by median
  const groups = d3.groups(data, (d) => d.region)
    .map(([region, rows]) => {
      const vals = rows.map((r) => +r.value).filter((v) => !isNaN(v)).sort(d3.ascending);
      return { region, vals, n: vals.length, median: d3.median(vals) };
    })
    .sort((a, b) => d3.ascending(a.median, b.median));

  const W = 760, H = 520;
  const m = { top: 100, right: 40, bottom: 56, left: 168 }; // left: room for tissue names; top: title+subtitle+ridge headroom
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
  svg.selectAll("*").remove();
  const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);

  // Cap the upper domain: nearly all mass is < ~150 HU; without this the axis runs to 800 (dead space).
  const lo = d3.min(data, (d) => +d.value), hi = d3.min([d3.max(data, (d) => +d.value), 150]);
  const x = d3.scaleLinear().domain([lo, hi]).nice().range([0, iw]);
  const y = d3.scalePoint().domain(groups.map((d) => d.region)).range([0, ih]).padding(0.6);

  // Gaussian KDE on a shared grid, with a shared height scale so rows are comparable
  const xs = x.ticks(80);
  const gauss = (u) => Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
  // Per-row height normalisation: each ridge peaks at the same height, so a narrow (tall-KDE)
  // distribution can't spike into the row above. Standard for ridgelines/joyplots.
  const densities = groups.map((grp) => {
    const sd = d3.deviation(grp.vals) || 1;
    const bw = 1.06 * sd * Math.pow(grp.vals.length, -1 / 5); // Silverman
    const dens = xs.map((xi) => [xi, d3.mean(grp.vals, (v) => gauss((xi - v) / bw)) / bw]);
    const peak = d3.max(dens, (p) => p[1]) || 1;
    return { ...grp, dens: dens.map((p) => [p[0], p[1] / peak]) }; // normalise to [0,1]
  });
  const overlap = 1.2; // modest overlap — ridgeline feel without collisions
  const rowH = (y.step() || ih / groups.length) * overlap;

  const area = d3.area().x((p) => x(p[0])).y0(0).y1((p) => -p[1] * rowH).curve(d3.curveBasis);
  const pretty = (s) => s.replace(/_/g, " ");

  // draw back-to-front (top rows first) so lower ridges sit in front
  densities.forEach((grp) => {
    const gy = y(grp.region);
    const row = g.append("g").attr("transform", `translate(0,${gy})`);
    row.append("path").attr("d", area(grp.dens))
      .attr("fill", P.primary).attr("fill-opacity", 0.55)
      .attr("stroke", P.paper).attr("stroke-width", 1);
    // median tick on the baseline
    row.append("line").attr("x1", x(grp.median)).attr("x2", x(grp.median)).attr("y1", 0).attr("y2", -6)
      .attr("stroke", P.ink).attr("stroke-width", 1);
    // direct label (left margin), lifted ABOVE the baseline so the ridge's fill edge (y=0) never
    // bisects the text (which reads as a strike-through). Labels live at x<0, clear of the fill.
    row.append("text").attr("x", -16).attr("y", -20).attr("text-anchor", "end")
      .attr("class", "ax-title").attr("fill", P.ink).text(pretty(grp.region));
    row.append("text").attr("x", -16).attr("y", -6).attr("text-anchor", "end")
      .attr("class", "annot").text(`n=${grp.n} · md ${grp.median.toFixed(0)}`);
  });

  // x-axis (hairline) at the bottom
  const xAxis = g.append("g").attr("transform", `translate(0,${ih})`)
    .call(d3.axisBottom(x).ticks(7).tickSize(-4).tickPadding(8));
  xAxis.select(".domain").attr("class", "ax-domain");
  xAxis.selectAll(".tick").attr("class", "ax-tick");

  // titles
  svg.append("text").attr("x", m.left).attr("y", 30).attr("class", "fig-title")
    .text("CT attenuation by tissue region");
  svg.append("text").attr("x", m.left - 40).attr("y", 30).attr("class", "panel-label").text("A");
  svg.append("text").attr("x", m.left).attr("y", 50).attr("class", "annot")
    .text(`MOOSE body-composition segmentations · ${data.length.toLocaleString()} regions · ${groups.length} tissues`);
  g.append("text").attr("x", iw / 2).attr("y", ih + 44).attr("text-anchor", "middle")
    .attr("class", "ax-title").text("Mean attenuation (HU)");
}
