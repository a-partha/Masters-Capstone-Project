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

  const width  = 960;
  const height = 720;
  const margin = { top: 120, right: 30, bottom: 80, left: 60 };

  const svg = d3.select("#lollipop-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
 
  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
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
    .range(["#910000","#004d91","#ab5c5c","#00913b"]);

  // Horizontal dashed gridlines
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
 
  // X‑axis
  const xAxisG = chart.append("g")
    .attr("transform", `translate(0,${y(0)})`)
    .call(d3.axisBottom(x0));

  xAxisG.selectAll("text")
    .style("font-family", "Cambo, serif")
    .style("font-size",   "1.8em")
    .style("fill",        "black");

  // X‑axis label
  chart.append("text")
    .attr("x", (width - margin.left - margin.right) / 2)
    .attr("y", y(0) + 55)
    .attr("text-anchor", "middle")
    .style("font-family", "Cambo, serif")
    .style("font-size", "1.1em")
    .style("fill", "black")
    .text("Game Time Period (min)");


   // Y‑axis
   const yAxisG = chart.append("g")
    .call(d3.axisLeft(y)
      .tickSize(6)
      .tickFormat(d3.format("~s"))
    )
    .call(g => g.selectAll(".tick line").attr("stroke", "black"))
    .call(g => g.select(".domain").remove());

  yAxisG.selectAll("text")
    .style("font-family", "Cambo, serif")
    .style("font-size", "1.8em")
    .style("fill", "black");

  // Y‑axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-family", "Cambo, serif")
    .style("font-size", "1.1em")
    .style("fill", "black")
    .text("Count");

  // Bins
  const bins = d3.groups(tidy, d => d.time_bin)
    .map(([key, values]) => ({
      time_bin: key,
      values: metrics.map(metric => {
        const m = values.find(d => d.metric === metric);
        return { metric, value: m ? m.value : 0 };
      })
    }));

  // Drawing the lollipops
  const groups = chart.selectAll("g.lollipop-group")
    .data(bins)
    .join("g")
      .attr("class", "lollipop-group")
      .attr("transform", d => `translate(${x0(d.time_bin)},0)`);

  // The sticks
  groups.selectAll("line")
    .data(d => d.values)
    .join("line")
      .attr("x1", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("x2", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("y1", y(0))
      .attr("y2", d => y(d.value))
      .attr("stroke", d => color(d.metric))
      .attr("stroke-width", 3.5);

  // The circles
  groups.selectAll("circle")
    .data(d => d.values)
    .join("circle")
      .attr("cx", d => x1(d.metric) + x1.bandwidth()/2)
      .attr("cy", d => y(d.value))
      .attr("r", 7)
      .attr("fill", d => color(d.metric));

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${margin.left+80}, 80)`);

  
let xOffset = 0;
const gap = 80;  // space between sticks

const legendItems = legend.selectAll("g")
  .data(metrics)
  .join("g")
    .attr("transform", function(d) {
      const tx = xOffset; 
      const dummyText = legend.append("text")
        .attr("x", -9999).attr("y", -9999)
        .style("font","0.7em Cambo, serif")
        .text(d);
      const textWidth = dummyText.node().getComputedTextLength();
      dummyText.remove();

      xOffset += 12  // Rectangle
               + 4   // Space between rectangle & text
               + textWidth
               + gap; 
      return `translate(${tx},0)`;
    })
  .each(function(d,i){
    const g = d3.select(this);
    // Append rectangle
    g.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color(d));
    // Append text
    g.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(d)
      .style("font-family","Cambo, serif")
      .style("font-size","1em")
      .style("fill","black");
  });
});
