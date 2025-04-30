const cols       = 12,
      rows       = 8,
      pitchW     = 120,
      pitchH     = 80,
      cellW      = pitchW / cols,
      cellH      = pitchH / rows,
      legendW    = 8,
      legendX    = pitchW + 5,
      extraSpace = legendW + 30;

// Trying to clone the pitch svg
const pitchSvg = document.querySelector("#pitch-viz svg");
if (!pitchSvg) {
  console.error("Pitch SVG not found — skipping xT overlay");
} 
else {
  const svgClone = pitchSvg.cloneNode(true);
  svgClone.removeAttribute("id");
  d3.select(svgClone).selectAll("[id]").nodes()
    .forEach(n => n.removeAttribute("id"));

  document.getElementById("xt-grid").appendChild(svgClone);

  const svg = d3.select("#xt-grid svg");
  const g   = svg.select("g");

  //Loading and rotating data
  d3.json("xt_grid_values.json").then(raw => {
    const data = raw.map(d => ({
      x: +d.x_bin,
      y: rows - 1 - d.y_bin,
      v: +d.xT
    }));

  //Color scale
    const vals = data.map(d => d.v),
          vmin = d3.min(vals),
          vmax = d3.max(vals);

    const color = d3.scaleSequential(d3.interpolatePuOr)
      .domain([vmin, vmax]);


    // Drawing transparent heatmap cells
    g.selectAll("rect.xt-cell")
      .data(data)
      .join("rect")
        .attr("class","xt-cell")
        .attr("x",      d => d.x * cellW)
        .attr("y",      d => d.y * cellH)
        .attr("width",  cellW)
        .attr("height", cellH)
        .attr("fill",   d => color(d.v))
        .attr("fill-opacity", 0.7)
        .attr("stroke","black")
        .attr("stroke-width",0.2);

    //Creating the gradient for the legend
    const defs = svg.append("defs");
    const grad = defs.append("linearGradient")
      .attr("id","xt-grad")
      .attr("x1","0%").attr("y1","100%")
      .attr("x2","0%").attr("y2","0%");

    d3.range(0,1.01,0.01).forEach(t => {
      grad.append("stop")
        .attr("offset", `${t*100}%`)
        .attr("stop-color", color(vmin + (vmax - vmin)*t));
  });

  // Drawing the gradient bar
  svg.append("rect")
    .attr("x",      legendX)
    .attr("y",      0)
    .attr("width",  legendW)
    .attr("height", pitchH)
    .style("fill",  "url(#xt-grad)")
    .style("stroke","black")
    .style("stroke-width",0.2);

  // Drawing the right-side axis
  const legendScale = d3.scaleLinear()
    .domain([vmin, vmax])
    .range([pitchH, 0]);

  svg.append("g")
    .attr("transform", `translate(${legendX + legendW},0)`)
    .call(d3.axisRight(legendScale).ticks(6).tickFormat(d3.format(".2f")))
    .call(g => g.selectAll("text")
      .attr("fill","black")
      .style("font-size","3px")
      .attr("dx","0.1em"))
    .call(g => g.selectAll("line")
      .attr("stroke","black")
      .attr("stroke-width",0.25))
    .call(g => g.select(".domain").remove());

  })
  .catch(err => console.error("xT load error:", err));
}
