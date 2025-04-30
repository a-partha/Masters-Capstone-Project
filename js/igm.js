// // 1) margins
// const margin = { top: 30, right: 10, bottom: 100, left: 60 };

// // 2) measure the container
// const plotContainer = d3.select("#line-chart").node();
// const totalWidth  = plotContainer.getBoundingClientRect().width;
// const totalHeight = plotContainer.getBoundingClientRect().height;

// // 3) compute inner drawing size
// const width  = totalWidth  - margin.left - margin.right;
// const height = totalHeight - margin.top  - margin.bottom;

// // 4) create a responsive SVG
// const svg = d3.select("#line-chart")
//   .append("svg")
//     .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
//     .style("width", "100%")
//     .style("height", "auto")
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // 5) append tooltip _inside_ the viz container
// const tooltip = d3.select("#igm-section .viz-container")
//   .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// // Load JSON data
// fetch("igm_plot.json")
//   .then(res => res.json())
//   .then(data => {
//     // extract unique team names
//     const opponents = Array.from(new Set(data.map(d => d.opponent)));

//     // --- create a button bar just above the SVG ---
//     const buttonBar = d3.select("#line-chart")
//       .append("div")
//       .attr("id", "team-buttons")
//       .style("position", "absolute")
//       .style("top",      "-1em")                 // flush to top    // shift right by your left margin
//       .style("display",  "flex")
//       .style("align-items", "center")
//       .style("gap",      "1em")
  

//     buttonBar.selectAll("button")
//       .data(opponents)
//       .enter()
//       .append("button")
//         .text(d => d)
//         .attr("class", "team-button")
//         .style('font-size', '0.8em')
//         .style('font-family', 'Cambo, serif')
//         .on("click", (event, team) => {
//           update(team);
//           // highlight the active one
//           buttonBar.selectAll("button")
//             .classed("active", d => d === team);
//         });

    
// // ─── INSERT LEGEND BAR ───────────────────────────────────────────────────────
// const legendItems = [
//      { label: "Arg. Goal",              color: "green"   },
//      { label: "Opp. Goal",             color: "maroon"     },
//      { label: "Arg. Substitution",      color: "mediumblue"    },
//      { label: "Opp. Substitution",     color: "darkorange"  },
//      { label: "Formation Shift",             color: "lightgrey"  },
// ];

// const legend = d3.select("#igm-section .viz-container")
//   .append("div")
//     .attr("id", "team-legend")
//     .style("position",      "absolute")
//     .style("top",           "1.3em")                
//     .style("display",       "flex")
//     .style("gap",           "1em")
//     .style("align-items",   "center")
//     .style("pointer-events","none");          

// legend.selectAll("div")
//   .data(legendItems)
//   .enter()
//   .append("div")
//     .style("display",     "flex")
//     .style("align-items", "center")
//     .html(d =>
//       `<span style="
//           width:12px; height:12px;
//           background:${d.color};
//           border-radius:50%;
//           display:inline-block;
//           margin-right:4px;
//         "></span>` +
//       `<span>${d.label}</span>`
//     );

// // ─────────────────────────────────────────────────────────────────────────────

// update(opponents[0]);
// buttonBar.selectAll("button")
//          .filter(d=>d===opponents[0])
//          .classed("active", true);


//     // initial draw & highlight first team
//     update(opponents[0]);

//     buttonBar.selectAll("button")
//       .filter(d => d === opponents[0])
//       .classed("active", true);

//     function update(selectedOpponent) {
//       console.clear();
//       console.log("⏱ update called for:", selectedOpponent);
//       const filtered = data.filter(d => d.opponent === selectedOpponent);
//       console.log("   → number of points:", filtered.length, "first few:", filtered.slice(0,5));

//       // clear previous drawing
//       svg.selectAll("*").remove();

//       // scales
//       const x = d3.scaleLinear()
//         .domain([0, d3.max(filtered, d => d.minute)])
//         .range([0, width]);
//       const y = d3.scaleLinear()
//         .domain([0, d3.max(filtered, d => d.pressure)])
//         .nice()
//         .range([height, 0]);

//       // axes
//       svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x))
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em');
      
//         // X‑axis label
//       svg.append("text")
//         .attr("class", "axis-label")
//         .attr("text-anchor", "middle")
//         .attr("x", width / 2)
//         .attr("y", height + margin.bottom - 55)
//         .attr("dx", "1em")    
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em')//
//         .text("Minute");

//       svg.append("g")
//         .call(d3.axisLeft(y))
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em');

//       // Y‑axis label
//       svg.append("text")
//         .attr("class", "axis-label")
//         .attr("text-anchor", "middle")
//         .attr("transform", `rotate(-90)`)
//         .attr("x", -height / 2)
//         .attr("y", -margin.left + 5) 
//         .attr("dy", "1em") 
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em')        
//         .text("# Ball Movements");

//       // mean line
//       const avg = d3.mean(filtered, d => d.pressure);
//       svg.append("line")
//         .attr("x1", 0)
//         .attr("x2", width)
//         .attr("y1", y(avg))
//         .attr("y2", y(avg))
//         .attr("stroke", "red")
//         .attr("stroke-dasharray", "9")
//         .attr("stroke-width", 2);

//       // pressure line
//       svg.append("path")
//         .attr("class", "pressure-line")
//         .datum(filtered)
//         .attr("fill", "none")
//         .attr("stroke", "rgb(3, 77, 151)")
//         .attr("stroke-width", 2)
     
//         .attr("d", d3.line()
//           .x(d => x(d.minute))
//           .y(d => y(d.pressure))
//         );

//       // trim whitespace from event text
//       filtered.forEach(d => {
//         if (d.events) d.events = d.events.map(s => s.trim());
//       });
      

//       // event markers
//       svg.selectAll("circle")
//         .data(filtered.filter(d => d.events && d.events.length>0))
//         .enter()
//         .append("circle")
//           .attr("cx", d => x(d.minute))
//           .attr("cy", d => y(d.pressure))
//           .attr("r", 5)
//           .attr("fill", d => {
//             const txt = d.events.join(" ");    
//             if (txt.includes("Goal") && txt.includes("(Argentina)")) return "green";
//             if (txt.includes("Goal"))              return "maroon";
          
//             if (d.events.some(ev => ev.includes("Substitution"))) {
//               return txt.includes("by Argentina") ? "mediumblue" : "darkorange";
//             }
          
//             if (txt.includes("Formation Shift"))  return "lightgrey";
//             return "gray";
//           })
          
//           .on("mouseover", function(event, d) {
//             // highlight dot
//             d3.select(this)
//               .transition().duration(100)
//               .attr("r", 8)
//               .attr("stroke", "#333")
//               .attr("stroke-width", 1.5);
//             const html = d.events
//               .map(ev => ev.replace(/\n/g, "<br>"))    // preserve your manual line-breaks
//               .join("<hr>");

//             // show tooltip
//             tooltip
//                 .html(html)
//                 .style("display", "block")
//                 .style("opacity", 1);

//                 // measure & clamp inside the chart
//             const pad  = 8;
//             const tipW = tooltip.node().offsetWidth;
//             const tipH = tooltip.node().offsetHeight;
//             const rect = plotContainer.getBoundingClientRect();

//             let tx = event.clientX - rect.left + pad;
//             let ty = event.clientY - rect.top - tipH - pad;
//             tx = Math.max(0, Math.min(tx, rect.width  - tipW));
//             ty = Math.max(0, Math.min(ty, rect.height - tipH));

//                 tooltip
//                   .style("left", `${tx}px`)
//                   .style("top",  `${ty}px`);
//           })

//           .on("mouseout", function() {
//             d3.select(this)
//               .transition().duration(150)
//               .attr("r", 5)
//               .attr("stroke", null);

//             tooltip
//               .transition().duration(200)
//               .style("opacity", 0);
//           });
//     }
//   });


// // 1) margins
// const margin = { top: 30, right: 10, bottom: 100, left: 60 };

// // 2) measure the container
// const plotContainer = d3.select("#line-chart").node();
// const totalWidth  = plotContainer.getBoundingClientRect().width;
// const totalHeight = plotContainer.getBoundingClientRect().height;

// // 3) compute inner drawing size
// const width  = totalWidth  - margin.left - margin.right;
// const height = totalHeight - margin.top  - margin.bottom;

// // 4) create a responsive SVG
// const svg = d3.select("#line-chart")
//   .append("svg")
//     .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
//     .style("width", "100%")
//     .style("height", "auto")
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // 5) append tooltip _inside_ the viz container
// const tooltip = d3.select("#igm-section .viz-container")
//   .append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// // Load JSON data
// fetch("igm_plot.json")
//   .then(res => res.json())
//   .then(data => {
//     // extract unique team names
//     const opponents = Array.from(new Set(data.map(d => d.opponent)));

//     // --- create a button bar just above the SVG ---
//     const buttonBar = d3.select("#line-chart")
//       .append("div")
//       .attr("id", "team-buttons")
//       .style("position", "absolute")
//       .style("top",      "-1em")                 // flush to top    // shift right by your left margin
//       .style("display",  "flex")
//       .style("align-items", "center")
//       .style("gap",      "1em")
  

//     buttonBar.selectAll("button")
//       .data(opponents)
//       .enter()
//       .append("button")
//         .text(d => d)
//         .attr("class", "team-button")
//         .style('font-size', '0.8em')
//         .style('font-family', 'Cambo, serif')
//         .on("click", (event, team) => {
//           update(team);
//           // highlight the active one
//           buttonBar.selectAll("button")
//             .classed("active", d => d === team);
//         });

    
// // ─── INSERT LEGEND BAR ───────────────────────────────────────────────────────
// const legendItems = [
//      { label: "Arg. Goal",              color: "green"   },
//      { label: "Opp. Goal",             color: "maroon"     },
//      { label: "Arg. Substitution",      color: "mediumblue"    },
//      { label: "Opp. Substitution",     color: "darkorange"  },
//      { label: "Formation Shift",             color: "lightgrey"  },
// ];

// const legend = d3.select("#igm-section .viz-container")
//   .append("div")
//     .attr("id", "team-legend")
//     .style("position",      "absolute")
//     .style("top",           "1.3em")                
//     .style("display",       "flex")
//     .style("gap",           "1em")
//     .style("align-items",   "center")
//     .style("pointer-events","none");          

// legend.selectAll("div")
//   .data(legendItems)
//   .enter()
//   .append("div")
//     .style("display",     "flex")
//     .style("align-items", "center")
//     .html(d =>
//       `<span style="
//           width:12px; height:12px;
//           background:${d.color};
//           border-radius:50%;
//           display:inline-block;
//           margin-right:4px;
//         "></span>` +
//       `<span>${d.label}</span>`
//     );

// // ─────────────────────────────────────────────────────────────────────────────

// update(opponents[0]);
// buttonBar.selectAll("button")
//          .filter(d=>d===opponents[0])
//          .classed("active", true);


//     // initial draw & highlight first team
//     update(opponents[0]);
//     buttonBar.selectAll("button")
//       .filter(d => d === opponents[0])
//       .classed("active", true);

//     function update(selectedOpponent) {
//       const filtered = data.filter(d => d.opponent === selectedOpponent);

//       // clear previous drawing
//       svg.selectAll("*").remove();

//       // scales
//       const x = d3.scaleLinear()
//         .domain([0, d3.max(filtered, d => d.minute)])
//         .range([0, width]);
//       const y = d3.scaleLinear()
//         .domain([0, d3.max(filtered, d => d.pressure)])
//         .nice()
//         .range([height, 0]);

//       // axes
//       svg.append("g")
//         .attr("transform", `translate(0,${height})`)
//         .call(d3.axisBottom(x))
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em');
      
//         // X‑axis label
//       svg.append("text")
//         .attr("class", "axis-label")
//         .attr("text-anchor", "middle")
//         .attr("x", width / 2)
//         .attr("y", height + margin.bottom - 55)
//         .attr("dx", "1em")    
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em')//
//         .text("Minute");

//       svg.append("g")
//         .call(d3.axisLeft(y))
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em');

//       // Y‑axis label
//       svg.append("text")
//         .attr("class", "axis-label")
//         .attr("text-anchor", "middle")
//         .attr("transform", `rotate(-90)`)
//         .attr("x", -height / 2)
//         .attr("y", -margin.left + 5) 
//         .attr("dy", "1em") 
//         .style('font-family', 'Cambo, serif') 
//         .style('font-size', '0.8em')        
//         .text("# Ball Movements");

//       // mean line
//       const avg = d3.mean(filtered, d => d.pressure);
//       svg.append("line")
//         .attr("x1", 0)
//         .attr("x2", width)
//         .attr("y1", y(avg))
//         .attr("y2", y(avg))
//         .attr("stroke", "red")
//         .attr("stroke-dasharray", "9")
//         .attr("stroke-width", 2);

//       // pressure line
//       svg.append("path")
//         .datum(filtered)
//         .attr("fill", "none")
//         .attr("stroke", "rgb(3, 77, 151)")
//         .attr("stroke-width", 2)
     
//         .attr("d", d3.line()
//           .x(d => x(d.minute))
//           .y(d => y(d.pressure))
//         );

//       // trim whitespace from event text
//       filtered.forEach(d => { if (d.event) d.event = d.event.trim(); });

//       // event markers
//       svg.selectAll("circle")
//               .data(filtered.filter(d => d.events && d.events.length>0))
//               .enter()
//               .append("circle")
//                 .attr("cx", d => x(d.minute))
//                 .attr("cy", d => y(d.pressure))
//                 .attr("r", 5)
//                 .attr("fill", d => {
//                   const txt = d.events.join(" ");    
//                   if (txt.includes("Goal") && txt.includes("(Argentina)")) return "green";
//                   if (txt.includes("Goal"))              return "maroon";
                
//                   if (d.events.some(ev => ev.includes("Substitution"))) {
//                     return txt.includes("by Argentina") ? "mediumblue" : "darkorange";
//                   }
                
//                   if (txt.includes("Formation Shift"))  return "lightgrey";
//                   return "gray";
//                 })
                
//                 .on("mouseover", function(event, d) {
//                   // highlight dot
//                   d3.select(this)
//                     .transition().duration(100)
//                     .attr("r", 8)
//                     .attr("stroke", "#333")
//                     .attr("stroke-width", 1.5);
//                   const html = d.events
//                     .map(ev => ev.replace(/\n/g, "<br>"))    // preserve your manual line-breaks
//                     .join("<hr>");
      
//                   // show tooltip
//                   tooltip
//                       .html(html)
//                       .style("display", "block")
//                       .style("opacity", 1);
      
//                       // measure & clamp inside the chart
//                   const pad  = 8;
//                   const tipW = tooltip.node().offsetWidth;
//                   const tipH = tooltip.node().offsetHeight;
//                   const rect = plotContainer.getBoundingClientRect();
      
//                   let tx = event.clientX - rect.left + pad;
//                   let ty = event.clientY - rect.top - tipH - pad;
//                   tx = Math.max(0, Math.min(tx, rect.width  - tipW));
//                   ty = Math.max(0, Math.min(ty, rect.height - tipH));
      
//                       tooltip
//                         .style("left", `${tx}px`)
//                         .style("top",  `${ty}px`);
//                 })
      
//                 .on("mouseout", function() {
//                   d3.select(this)
//                     .transition().duration(150)
//                     .attr("r", 5)
//                     .attr("stroke", null);
      
//                   tooltip
//                     .transition().duration(200)
//                     .style("opacity", 0);
//                 });
//           }
//         });


// 1) margins
const margin = { top: 30, right: 10, bottom: 100, left: 60 };

// 2) measure the container
const plotContainer = d3.select("#line-chart").node();
const totalWidth  = plotContainer.getBoundingClientRect().width;
const totalHeight = plotContainer.getBoundingClientRect().height;

// 3) compute inner drawing size
const width  = totalWidth  - margin.left - margin.right;
const height = totalHeight - margin.top  - margin.bottom;

// 4) create a responsive SVG
const svg = d3.select("#line-chart")
  .append("svg")
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .style("width", "100%")
    .style("height", "auto")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 5) append tooltip _inside_ the viz container
const tooltip = d3.select("#igm-section .viz-container")
  .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load JSON data
fetch("igm_plot.json")
  .then(res => res.json())
  .then(data => {
    // extract unique team names
    const opponents = Array.from(new Set(data.map(d => d.opponent)));

    // --- create a button bar just above the SVG ---
    const buttonBar = d3.select("#line-chart")
      .append("div")
        .attr("id", "team-buttons")
        .style("position", "absolute")
        .style("top", "-1em")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "1em");

    buttonBar.selectAll("button")
      .data(opponents)
      .enter()
      .append("button")
        .text(d => d)
        .attr("class", "team-button")
        .style("font-size", "0.8em")
        .style("font-family", "Cambo, serif")
        .on("click", (event, team) => {
          update(team);
          buttonBar.selectAll("button")
            .classed("active", d => d === team);
        });

    // ─── INSERT LEGEND BAR ───────────────────────────────────────────────────────
    const legendItems = [
      { label: "Single Key Events",   color: "mediumblue" },
      { label: "Multiple Key Events",     color: "maroon"  },
    ];

    const legend = d3.select("#igm-section .viz-container")
      .append("div")
        .attr("id", "team-legend")
        .style("position",      "absolute")
        .style("top",           "1.3em")
        .style("display",       "flex")
        .style("gap",           "1em")
        .style("align-items",   "center")
        .style("pointer-events","none");

    legend.selectAll("div")
      .data(legendItems)
      .enter()
      .append("div")
        .style("display",     "flex")
        .style("align-items", "center")
        .html(d =>
          `<span style="
              width:12px; height:12px;
              background:${d.color};
              border-radius:50%;
              display:inline-block;
              margin-right:4px;
            "></span>` +
          `<span>${d.label}</span>`
        );
    // ─────────────────────────────────────────────────────────────────────────────

    update(opponents[0]);
    buttonBar.selectAll("button")
      .filter(d => d === opponents[0])
      .classed("active", true);

    function update(selectedOpponent) {
      const filtered = data.filter(d => d.opponent === selectedOpponent);

      // clear previous drawing
      svg.selectAll("*").remove();

      // scales
      const x = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d.minute)])
        .range([0, width]);
      const y = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d.pressure)])
        .nice()
        .range([height, 0]);

      // axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style('font-family', 'Cambo, serif')
        .style('font-size', '0.8em');

      // X-axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 55)
        .attr("dx", "1em")
        .style('font-family', 'Cambo, serif')
        .style('font-size', '0.8em')
        .text("Minute");

      svg.append("g")
        .call(d3.axisLeft(y))
        .style('font-family', 'Cambo, serif')
        .style('font-size', '0.8em');

      // Y-axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -height / 2)
        .attr("y", -margin.left + 5)
        .attr("dy", "1em")
        .style('font-family', 'Cambo, serif')
        .style('font-size', '0.8em')
        .text("# Ball Movements");

      // mean line
      const avg = d3.mean(filtered, d => d.pressure);
      svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(avg))
        .attr("y2", y(avg))
        .attr("stroke", "red")
        .attr("stroke-dasharray", "9")
        .attr("stroke-width", 2);

      svg.append("text")
        .attr("x", -18)                 
        .attr("y", y(avg))              
        .attr("dy", "0.3em")          
        .attr("text-anchor", "end")     
        .style("fill", "red")
        .style("font-size", "0.8em")
        .style("paint-order", "stroke") 
        .style("stroke", "black")      
        .style("stroke-width", "0.3px")  
        .style("fill", "red")          
        .text("Average");

      // pressure line
      svg.append("path")
        .datum(filtered)
        .attr("fill", "none")
        .attr("stroke", "rgb(3, 77, 151)")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(d => x(d.minute))
          .y(d => y(d.pressure))
        );

      // trim whitespace from event text
      filtered.forEach(d => { if (d.event) d.event = d.event.trim(); });

      // event markers: single vs. multiple events only
      svg.selectAll("circle")
        .data(filtered.filter(d => d.events && d.events.length > 0))
        .enter()
        .append("circle")
          .attr("cx", d => x(d.minute))
          .attr("cy", d => y(d.pressure))
          .attr("r", 5)
          .attr("fill", d => d.events.length === 1 ? "mediumblue" : "maroon")
          .on("mouseover", function(event, d) {
            // highlight dot
            d3.select(this)
              .transition().duration(100)
              .attr("r", 8)
              .attr("stroke", "#333")
              .attr("stroke-width", 1.5);
            const html = d.events
              .map(ev => ev.replace(/\n/g, "<br>"))
              .join("<hr>");

            // show tooltip
            tooltip
              .html(html)
              .style("display", "block")
              .style("opacity", 1);

            // clamp tooltip inside chart
            const pad  = 8;
            const tipW = tooltip.node().offsetWidth;
            const tipH = tooltip.node().offsetHeight;
            const rect = plotContainer.getBoundingClientRect();

            let tx = event.clientX - rect.left + pad;
            let ty = event.clientY - rect.top - tipH - pad;
            tx = Math.max(0, Math.min(tx, rect.width  - tipW));
            ty = Math.max(0, Math.min(ty, rect.height - tipH));

            tooltip
              .style("left", `${tx}px`)
              .style("top",  `${ty}px`);
          })
          .on("mouseout", function() {
            d3.select(this)
              .transition().duration(150)
              .attr("r", 5)
              .attr("stroke", null);
            tooltip
              .transition().duration(200)
              .style("opacity", 0);
          });
    }
  });
