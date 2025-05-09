d3.json("xt_messi.json").then(tableData => {
    // Converting 0/1 → false/true and formatting xT gain
    const data = tableData.map(d => ({
      "Messi's Involvement":   d.messi_involved === 1 ? "Yes" : "No",
      "Average Sequence xT Gain": d.total_xt_gain.toFixed(4)
    }));
  
    // Column headers
    const columns = ["Messi's Involvement", "Average Sequence xT Gain"];

    // Building the table
    const table = d3.select("#messi-table")
      .append("table")
        .style("border-collapse", "collapse")
        .style("width", "80%")
        .style("font-family", "Cambo, serif")
        .style("font","1em");


    table.selectAll("th, td")
        .style("padding", "0.5em 0.75em")
        
    table.selectAll("th")
        .style("background-color", "rgba(255,255,255,0.2)")
        .style("text-transform", "uppercase")
        .style("font-weight", "500")
        .style("color", "white");
        
    table.selectAll("td")
        .style("color", "white");
  
    // Table headers
    const thead = table.append("thead");
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .join("th")
        .text(d => d)
        .style("padding","0.5em")
        .style("border-bottom","1.5px solid")
        .style("text-align","center");
  
    // Table body
    const tbody = table.append("tbody");
    const rows = tbody.selectAll("tr")
      .data(data)
      .join("tr");
  
    rows.selectAll("td")
      .data(row => columns.map(col => row[col]))
      .join("td")
        .text(d => d)
        .style("padding","0.4em")
        .style("border-bottom","1.5px solid")
        .style("text-align","center");     
  })
  .catch(err => console.error("Failed to load Messi JSON:", err));