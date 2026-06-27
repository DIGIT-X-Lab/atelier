/**
 * Bland–Altman — house seed recipe (method-comparison / agreement).
 *
 * Contract every recipe follows:  export function render({ svg, d3, theme, data })
 *   - draw onto `svg` using house primitive classes (.ax-*, .fig-title, .annot, .panel-label)
 *   - take colors from `theme.palette` (never hard-code hues)
 *   - obey the craft bar: generous margins, no overlap, direct labels, one focal point
 *
 * data: [{ a: <method A>, b: <method B> }, ...]  (falls back to a built-in demo)
 */
export function render({ svg, d3, theme }) {
  const P = theme.palette;
  // --- demo data if none supplied (paired measurements of one quantity) ---
  const rng = d3.randomNormal.source(d3.randomLcg(42));
  const data = (render.data) || d3.range(140).map(() => {
    const mean = 8 + rng(0, 4)();
    const diff = rng(0, 1.1)() + mean * 0.02;
    return { a: mean + diff / 2, b: mean - diff / 2 };
  });

  const W = 720, H = 480;
  const m = { top: 72, right: 96, bottom: 56, left: 72 }; // top room for title+subtitle; right for limit labels
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("width", W).attr("height", H);
  svg.selectAll("*").remove();

  const pts = data.map((d) => ({ mean: (d.a + d.b) / 2, diff: d.a - d.b }));
  const bias = d3.mean(pts, (d) => d.diff);
  const sd = d3.deviation(pts, (d) => d.diff);
  const loA = bias - 1.96 * sd, hiA = bias + 1.96 * sd;

  const g = svg.append("g").attr("transform", `translate(${m.left},${m.top})`);
  const x = d3.scaleLinear().domain(d3.extent(pts, (d) => d.mean)).nice().range([0, iw]);
  const yPad = (hiA - loA) * 0.5 + sd;
  const y = d3.scaleLinear().domain([Math.min(loA, d3.min(pts, (d) => d.diff)) - yPad * 0.2,
                                     Math.max(hiA, d3.max(pts, (d) => d.diff)) + yPad * 0.2]).nice().range([ih, 0]);

  // axes (hairline)
  const xAxis = g.append("g").attr("transform", `translate(0,${ih})`).attr("class", "ax")
    .call(d3.axisBottom(x).ticks(6).tickSize(-4).tickPadding(8));
  const yAxis = g.append("g").attr("class", "ax").call(d3.axisLeft(y).ticks(6).tickSize(-4).tickPadding(8));
  for (const ax of [xAxis, yAxis]) {
    ax.select(".domain").attr("class", "ax-domain");
    ax.selectAll(".tick").attr("class", "ax-tick");
  }

  // reference lines: bias (solid primary) + limits of agreement (dashed neutral)
  const line = (val, color, dash, label) => {
    g.append("line").attr("x1", 0).attr("x2", iw).attr("y1", y(val)).attr("y2", y(val))
      .attr("stroke", color).attr("stroke-width", 1.5).attr("stroke-dasharray", dash);
    g.append("text").attr("x", iw + 8).attr("y", y(val)).attr("dy", "0.32em")
      .attr("class", "annot").attr("fill", color).text(label);
    g.append("text").attr("x", iw + 8).attr("y", y(val) + 13).attr("dy", "0.32em")
      .attr("class", "annot").text(val.toFixed(2));
  };
  line(hiA, P.inkFaint, "4 3", "+1.96 SD");
  line(loA, P.inkFaint, "4 3", "−1.96 SD");
  line(bias, P.primary, null, "bias");

  // points (single focal series)
  g.selectAll("circle").data(pts).join("circle")
    .attr("cx", (d) => x(d.mean)).attr("cy", (d) => y(d.diff)).attr("r", 3.2)
    .attr("fill", P.primary).attr("fill-opacity", 0.55).attr("stroke", P.paper).attr("stroke-width", 0.6);

  // title (with panel label) + stats subtitle directly beneath it — no collision with axis labels
  svg.append("text").attr("x", m.left).attr("y", 30).attr("class", "fig-title")
    .text("Agreement between methods (Bland–Altman)");
  svg.append("text").attr("x", m.left - 56).attr("y", 30).attr("class", "panel-label").text("A");
  svg.append("text").attr("x", m.left).attr("y", 50).attr("class", "annot")
    .text(`n = ${pts.length}   ·   bias ${bias.toFixed(2)}   ·   95% LoA [${loA.toFixed(2)}, ${hiA.toFixed(2)}]`);
  // axis titles
  g.append("text").attr("x", iw / 2).attr("y", ih + 44).attr("text-anchor", "middle")
    .attr("class", "ax-title").text("Mean of two methods");
  g.append("text").attr("transform", `translate(${-52},${ih / 2}) rotate(-90)`)
    .attr("text-anchor", "middle").attr("class", "ax-title").text("Difference (A − B)");
}
