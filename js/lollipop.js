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
  
    const width = 960;
    const height = 520;
    const margin = { top: 120, right: 30, bottom: 50, left: 50 };
  
    const svg = d3.select("#lollipop-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
    /* remove any .attr("width", …) and .attr("height", …) calls */


    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 18)  // ← adjust this if needed
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
      .text("Count");

    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    //   svg.append("text")
    //     .attr("x", margin.left - 40)
    //     .attr("y", margin.top - 10)
    //     .attr("text-anchor", "start")
    //     .attr("font-size", "11px")
    //     .attr("fill", "black")
    //     .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
    //     .text("↑ Count");

  
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
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);
  
    // Horizontal dashed gridlines (black, correct dash)
    chart.append("g")
      .lower()
      .call(d3.axisLeft(y)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat("")
      )
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "100,10")
      )
      .call(g => g.select(".domain").remove());
  
    // Y-axis with solid black ticks + black labels
    chart.append("g")
      .call(d3.axisLeft(y)
        .tickSize(6)
        .tickFormat(d3.format("~s"))
      )
      .call(g => g.selectAll(".tick line").attr("stroke", "black"))
      .call(g => g.selectAll("text")
        .attr("fill", "black")
        .style("font-size", "11px")
        .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")

      )
      .call(g => g.select(".domain").remove());
  
    // X-axis
    chart.append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .style("font-size", "11px")
      .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
      .style("fill", "black");
  
    
    chart.append("text")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", y(0) + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
        .text("Game Time Period (min)");

    
      // Group data by bin
    const bins = d3.groups(tidy, d => d.time_bin)
      .map(([key, values]) => ({
        time_bin: key,
        values: metrics.map(metric => {
          const match = values.find(d => d.metric === metric);
          return {
            metric,
            value: match ? match.value : 0
          };
        })
      }));
  
    const groups = chart.selectAll("g.lollipop-group")
      .data(bins)
      .join("g")
      .attr("class", "lollipop-group")
      .attr("transform", d => `translate(${x0(d.time_bin)},0)`);
  
    // Colored sticks (thin)
    groups.selectAll("line")
      .data(d => d.values)
      .join("line")
      .attr("x1", d => x1(d.metric) + x1.bandwidth() / 2)
      .attr("x2", d => x1(d.metric) + x1.bandwidth() / 2)
      .attr("y1", y(0))
      .attr("y2", d => y(d.value))
      .attr("stroke", d => color(d.metric))
      .attr("stroke-width", 1.5);
  
    // Colored dots (small, no stroke)
    groups.selectAll("circle")
      .data(d => d.values)
      .join("circle")
      .attr("cx", d => x1(d.metric) + x1.bandwidth() / 2)
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", d => color(d.metric));
  
    // ✅ LEGEND (top-aligned, horizontal)
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left+80}, 80)`);
    
  
    const legendItems = legend.selectAll("g")
      .data(metrics)
      .join("g")
      .attr("transform", (d, i) => `translate(${i * 180}, 0)`);
  
    legendItems.append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => color(d));
  
    legendItems.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text(d => d)
      .style("font-size", "12px")
      .style("fill", "black")
      .style("font-family", "Raleway, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")

  });
  
