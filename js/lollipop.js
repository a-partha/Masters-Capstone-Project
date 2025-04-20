d3.csv("arg_shots_summary.csv", d3.autoType).then(raw => {
  const data = raw.map(d => {
    const entries = Object.entries(d);
    return {
      time_bin: entries[0][1].trim(),
      ...Object.fromEntries(entries.slice(1))
    };
  });

  const metrics = [
    "Total Shots",
    "Total Goals",
    "Shots After Pressure",
    "Goals After Pressure"
  ];

  const tidy = [];
  data.forEach(d => {
    metrics.forEach(metric => {
      tidy.push({
        time_bin: d.time_bin,
        metric,
        value: +d[metric]
      });
    });
  });

  // — dimensions & margins
  const width  = 960;
  const height = 620;
  const margin = { top: 120, right: 30, bottom: 80, left: 50 };

  // — responsive SVG
  const svg = d3.select("#lollipop-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

 

  // — chart group
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // — scales
  const x0 = d3.scaleBand()
    .domain([...new Set(tidy.map(d => d.time_bin))])
    .range([0, width - margin.left - margin.right])
    .padding(0.4);

  const x1 = d3.scaleBand()
    .domain(metrics)
    .range([0, x0.bandwidth()])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(tidy, d => d.value)])
    .nice()
    .range([height - margin.top - margin.bottom, 0]);

  const color = d3.scaleOrdinal()
    .domain(metrics)
    .range([ "#2ca02c","#a6d854", "#9467bd", "#1f77b4"]);

  // — horizontal dashed gridlines
  chart.append("g")
    .lower()
    .call(d3.axisLeft(y)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat("")
    )
    .call(g => g.selectAll(".tick line")
      .attr("stroke", "steelblue")
      .attr("stroke-dasharray", "100,10")
    )
    .call(g => g.select(".domain").remove());

 
  // — X‑axis
  const xAxisG = chart.append("g")
    .attr("transform", `translate(0,${y(0)})`)
    .call(d3.axisBottom(x0));

  xAxisG.selectAll("text")
    .style("font-family", "Cambo, serif")
    .style("font-size",   "1.2em")
    .style("fill",        "black");

  // — X‑axis label
  chart.append("text")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", y(0) + 40)
    .attr("text-anchor", "middle")
    .style("font-family", "Cambo, serif")
    .style("font-size",   "0.8em")
    .style("fill",        "black")
    .text("Game Time Period (min)");


   // — Y‑axis with tick labels
   const yAxisG = chart.append("g")
   .call(d3.axisLeft(y)
     .tickSize(6)
     .tickFormat(d3.format("~s"))
   )
   .call(g => g.selectAll(".tick line").attr("stroke", "black"))
   .call(g => g.select(".domain").remove());

    yAxisG.selectAll("text")
   .style("font-family", "Cambo, serif")
   .style("font-size",   "1.2em")
   .style("fill",        "black");

 // — Y‑axis label
 svg.append("text")
 .attr("transform", "rotate(-90)")
 .attr("x", -height / 2)
 .attr("y", 18)              // tweak as needed
 .attr("text-anchor", "middle")
 .style("font-family", "Cambo, serif")
 .style("font-size",   "0.8em")
 .style("fill",        "black")
 .text("Count");

  // — pivot into bins
  const bins = d3.groups(tidy, d => d.time_bin)
    .map(([key, values]) => ({
      time_bin: key,
      values: metrics.map(metric => {
        const m = values.find(d => d.metric === metric);
        return { metric, value: m ? m.value : 0 };
      })
    }));

  // — draw lollipops
  const groups = chart.selectAll("g.lollipop-group")
    .data(bins)
    .join("g")
      .attr("class", "lollipop-group")
      .attr("transform", d => `translate(${x0(d.time_bin)},0)`);

  // sticks
  groups.selectAll("line")
    .data(d => d.values)
    .join("line")
      .attr("x1", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("x2", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("y1", y(0))
      .attr("y2", d => y(d.value))
      .attr("stroke", d => color(d.metric))
      .attr("stroke-width", 1.5);

  // dots
  groups.selectAll("circle")
    .data(d => d.values)
    .join("circle")
      .attr("cx", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", d => color(d.metric));

  // — legend
  const legend = svg.append("g")
    .attr("transform", `translate(${margin.left+80}, 80)`);

  const legendItems = legend.selectAll("g")
    .data(metrics)
    .join("g")
      .attr("transform", (d,i) => `translate(${i*180}, 0)`);

  legendItems.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => color(d));

  legendItems.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .text(d => d)
    .style("font-family", "Cambo, serif")
    .style("font-size",   "0.7em")
    .style("fill",        "black");
});
