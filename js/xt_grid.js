// // xt_grid.js

// // 0) PARAMETERS
// const cols      = 12,
//       rows      = 8,
//       pitchW    = 120,
//       pitchH    = 80,
//       cellW     = pitchW / cols,
//       cellH     = pitchH / rows,
//       legendW   = 8,
//       legendX   = pitchW + 5,     // margin between pitch & legend
//       extraSpace= legendW + 30;   // room for tick labels

// // 1) SET UP SVG with extra width
// const svg = d3.select("#xt-grid")
//   .append("svg")
//     .attr("viewBox", `0 0 ${pitchW + extraSpace} ${pitchH}`)
//     .attr("preserveAspectRatio", "xMidYMid meet")
//   .append("g");

// // grab the <g> inside the pitch-viz svg that you created earlier
// // const svg = d3.select("#pitch-viz svg g");



// // 2) LOAD & ROTATE DATA
// d3.json("xt_grid_values.json").then(raw => {
//   // Python did xt_grid_rotated = xt_grid.T[::-1], which in JS is:
//   const data = raw.map(d => ({
//     x: +d.x_bin,
//     // flip y: rows-1 - original y_bin
//     y: rows - 1 - d.y_bin,
//     v: +d.xT
//   }));

//   // 3) BUILD COLOR SCALE (continuous Reds, low→light, high→dark)
//   const vals = data.map(d => d.v),
//         vmin = d3.min(vals),
//         vmax = d3.max(vals);

// const color = d3.scaleSequential(d3.interpolateRdBu)  // red ↔ blue diverging
//         .domain([vmax, vmin]);   // flip so cold=blue, hot=red
      
      
      

// // const color = d3.scaleQuantize()
// //     .domain([vmin, vmax])
// //     .range(d3.schemeRdYlGn[7])

//   // 4) DRAW THE CELLS
//   svg.selectAll("rect.cell")
//     .data(data)
//     .join("rect")
//       .attr("class","cell")
//       .attr("x",      d => d.x * cellW)
//       .attr("y",      d => d.y * cellH)
//       .attr("width",  cellW)
//       .attr("height", cellH)
//       .attr("fill",   d => color(d.v))
//       .attr("fill-opacity", 0.6)     // <-- 60% solid, 40% see‑through
//       .attr("stroke","black")
//       .attr("stroke-width",0.2);

//   // 5) CREATE THE GRADIENT FOR THE LEGEND
//   const defs = svg.append("defs");
//   const grad = defs.append("linearGradient")
//     .attr("id","xt-grad")
//     .attr("x1","0%").attr("y1","100%")
//     .attr("x2","0%").attr("y2","0%");

//   d3.range(0,1.01,0.01).forEach(t => {
//     grad.append("stop")
//       .attr("offset", `${t*100}%`)
//       .attr("stop-color", color(vmin + (vmax - vmin)*t));
//   });

//   // 6) DRAW THE GRADIENT BAR
//   svg.append("rect")
//     .attr("x",      legendX)
//     .attr("y",      0)
//     .attr("width",  legendW)
//     .attr("height", pitchH)
//     .style("fill",  "url(#xt-grad)")
//     .style("stroke","black")
//     .style("stroke-width",0.2);

//   // 7) DRAW THE RIGHT‑SIDE AXIS
//   const legendScale = d3.scaleLinear()
//     .domain([vmin, vmax])
//     .range([pitchH, 0]);

//   svg.append("g")
//     .attr("transform", `translate(${legendX + legendW},0)`)
//     .call(d3.axisRight(legendScale).ticks(6).tickFormat(d3.format(".2f")))
//     .call(g => g.selectAll("text")
//       .attr("fill","black")
//       .style("font-size","3px")
//       .attr("dx","0.25em"))
//     .call(g => g.selectAll("line")
//       .attr("stroke","black")
//       .attr("stroke-width",0.25))
//     .call(g => g.select(".domain").remove());

// }).catch(err => console.error("xT load error:", err));



// xt_grid.js

// 0) PARAMETERS…
const cols       = 12,
      rows       = 8,
      pitchW     = 120,
      pitchH     = 80,
      cellW      = pitchW / cols,
      cellH      = pitchH / rows,
      legendW    = 8,
      legendX    = pitchW + 5,
      extraSpace = legendW + 30;

// 1) TRY TO CLONE THE PITCH SVG
const pitchSvg = document.querySelector("#pitch-viz svg");
if (!pitchSvg) {
  console.error("Pitch SVG not found — skipping xT overlay");
} else {
  // Deep‐clone the <svg> and strip IDs
  const svgClone = pitchSvg.cloneNode(true);
  svgClone.removeAttribute("id");
  d3.select(svgClone).selectAll("[id]").nodes()
    .forEach(n => n.removeAttribute("id"));

  // Append the clone into your xt‐container
  document.getElementById("xt-grid").appendChild(svgClone);

  // Select the cloned <svg> and its main <g>
  const svg = d3.select("#xt-grid svg");
  const g   = svg.select("g");

  // 2) LOAD & ROTATE DATA
  d3.json("xt_grid_values.json").then(raw => {
    const data = raw.map(d => ({
      x: +d.x_bin,
      y: rows - 1 - d.y_bin,
      v: +d.xT
    }));

    // 3) COLOR SCALE
    const vals = data.map(d => d.v),
          vmin = d3.min(vals),
          vmax = d3.max(vals);

    const color = d3.scaleSequential(d3.interpolatePuOr)
      .domain([vmin, vmax]);

    // const color = d3.scaleQuantize()
    //     .domain([vmin, vmax])
    //     .range(d3.schemePuOr[11]);

    // 4) DRAW HEATMAP CELLS (with transparency)
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

    // 5) CREATE THE GRADIENT FOR THE LEGEND
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

  // 6) DRAW THE GRADIENT BAR
  svg.append("rect")
    .attr("x",      legendX)
    .attr("y",      0)
    .attr("width",  legendW)
    .attr("height", pitchH)
    .style("fill",  "url(#xt-grad)")
    .style("stroke","black")
    .style("stroke-width",0.2);

  // 7) DRAW THE RIGHT‑SIDE AXIS
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
