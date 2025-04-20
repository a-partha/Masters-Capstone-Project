document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('formation-viz');
    const width = container.clientWidth;
    const height = container.clientHeight;
  
    const svg = d3.select('#formation-viz')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 120 80`)
      .append('g');
  
    // Draw pitch outline
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 120)
        .attr('height', 80)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Center line
    svg.append('line')
        .attr('x1', 60)
        .attr('y1', 0)
        .attr('x2', 60)
        .attr('y2', 80)
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Center circle
    svg.append('circle')
        .attr('cx', 60)
        .attr('cy', 40)
        .attr('r', 9.15)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Center dot
    svg.append('circle')
        .attr('cx', 60)
        .attr('cy', 40)
        .attr('r', 0.5)
        .attr('fill', 'white');

    // Left penalty box
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 18)
        .attr('width', 18)
        .attr('height', 44)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Right penalty box
    svg.append('rect')
        .attr('x', 102)
        .attr('y', 18)
        .attr('width', 18)
        .attr('height', 44)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Left 6-yard box
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 30)
        .attr('width', 6)
        .attr('height', 20)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Right 6-yard box
    svg.append('rect')
        .attr('x', 114)
        .attr('y', 30)
        .attr('width', 6)
        .attr('height', 20)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Goal posts - left
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 36)
        .attr('width', 1)
        .attr('height', 8)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Goal posts - right
    svg.append('rect')
        .attr('x', 119)
        .attr('y', 36)
        .attr('width', 1)
        .attr('height', 8)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Penalty spots
    svg.append('circle')
        .attr('cx', 12)
        .attr('cy', 40)
        .attr('r', 0.5)
        .attr('fill', 'white');

    svg.append('circle')
        .attr('cx', 108)
        .attr('cy', 40)
        .attr('r', 0.5)
        .attr('fill', 'white');

    // Function to create arc path
    function createArcPath(startAngle, endAngle) {
        return d3.arc()
            .innerRadius(9.15)
            .outerRadius(9.15)
            .startAngle(startAngle)
            .endAngle(endAngle);
    }

    // Left penalty arc
    svg.append('path')
        .attr('d', createArcPath(0.25 * Math.PI, 0.75 * Math.PI)())
        .attr('transform', `translate(12,40)`)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3);

    // Right penalty arc
    svg.append('path')
        .attr('d', createArcPath(-0.75 * Math.PI, -0.25 * Math.PI)())
        .attr('transform', `translate(108,40)`)
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.3); 

    // Arrowhead definition
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-5 -5 10 10')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('markerWidth', 3)
        .attr('markerHeight', 3)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M -5,-5 L 5,0 L -5,5')
        .attr('fill', 'black');
    
    // Top straight arrow
    svg.append('line')
        .attr('x1', 10)
        .attr('y1', 5)
        .attr('x2', 110)
        .attr('y2', 5)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
        .attr('marker-end', 'url(#arrowhead)');

    // Top label
    svg.append('text')
        .attr('x', 60.5)
        .attr('y', 3.1)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', 2.2)
        .style('font-family', 'Cambo, serif')
        .style('font-weight', 600)
        .attr('opacity', 0.4)
        .text('Direction of Play');

    // Bottom straight arrow
    svg.append('line')
        .attr('x1', 10)
        .attr('y1', 75)
        .attr('x2', 110)
        .attr('y2', 75)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
        .attr('marker-end', 'url(#arrowhead)');

    // Bottom label
    svg.append('text')
        .attr('x', 60.5)
        .attr('y', 78.1)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', 2.2)
        .style('font-family', 'Cambo, serif')
        .style('font-weight', 600)
        .attr('opacity', 0.4)
        .text('Direction of Play');


    
    // Dotted lines for thirds
    const thirdLines = [40, 80]; // X positions for thirds (0–40, 40–80, 80–120)

    thirdLines.forEach(x => {
    svg.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', 80)
        .attr('stroke', 'black')
        .attr('stroke-width', 0.3)
        .attr('opacity', 0.4)
        .attr('stroke-dasharray', '3.5, 3.5');
    });

    const thirds = [
        { x: 21, label: 'Defensive Third' },
        { x: 63, label: 'Middle Third' },
        { x: 99, label: 'Attacking Third' }
      ];
      
    thirds.forEach(d => {
    svg.append('text')
        .attr('x', d.x)
        .attr('y', 40) // vertical center of pitch
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(90, ${d.x}, 40)`)
        .text(d.label)
        .attr('fill', 'black')
        .attr('opacity', 0.4)
        .style('font-size', '5px')
        .style('font-family', 'Cambo, serif')
        .style('font-weight', 600);
    });
      

  
    // 4-2-3-1 player dots
    const positions = [
        { x: 6, y: 40 },     // GK
        { x: 27, y: 10 },    // LB
        { x: 27, y: 30 },    // LCB
        { x: 27, y: 50 },    // RCB
        { x: 27, y: 70 },    // RB
      
        { x: 50, y: 30 },    // LDM 
        { x: 50, y: 50 },     // RDM
      
    
        { x: 74, y: 10 },    // LW
        { x: 74, y: 40 },    // CAM 
        { x: 74, y: 70 },     // RW
      
        { x: 93, y: 40 }    // ST 
      ];  
      
    // Draw high press zone with hover interaction
    const pressZone = svg.append('rect')
        .attr('x', 40)
        .attr('y', 0)
        .attr('width', 80)
        .attr('height', 80)
        .attr('fill', 'rgba(255, 0, 0, 0.22)')
        .attr('stroke', 'none')
        .attr('class', 'press-zone');

    // Add text tooltip using HTML div
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'press-tooltip')
        .style('position', 'absolute')
        .style('padding', '0.4rem 0.8rem')
        .style('background', 'rgba(202, 0, 0, 0.8)')
        .style('color', 'white')
        .style('border-radius', '4px')
        .style('border-color','rgb(0, 0, 0)')
        .style('border-width','thick')
        .style('font-size', '0.9rem')
        .style('font-family', 'Cambo, serif')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .text('High Press Zone');

    // Hover interaction
    pressZone
        .on('mouseover', (event) => {
            d3.select(event.currentTarget)
                .attr('fill', 'rgba(255, 0, 0, 0.35)');
        
            tooltip
                .style('opacity', 1);
        })
        
        .on('mousemove', (event) => {
            tooltip
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 20}px`);
        })
        .on('mouseout', (event) => {
            d3.select(event.currentTarget)
                .attr('fill', 'rgba(255, 0, 0, 0.22)');

            tooltip
                .style('opacity', 0);
        });
    
    svg.selectAll('.dot')
        .data(positions)
        .enter()
        .append('circle')
        .attr('class', 'dot') 
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 2)
        .attr('fill', (d, i) => i === 0 ? '#FFD700' : 'rgb(0, 92, 183)') // yellow for GK, dark blue for rest
        .attr('opacity', 1);

    const sliders = d3.selectAll("input[type='range']");
    const resultText = d3.select("#result");

    function updateResult() {
        let sum = 0;

        sliders.each(function () {
            const slider = d3.select(this);
            const value = +slider.property("value");
            const id = slider.attr("id");
            sum += value;

            // Update the corresponding counter
            d3.select(`#${id}Counter`).text(value);
        });

        const result = Math.max(0, 10 - 0.3 * sum);
        resultText.text(result.toFixed(2));
    }

    sliders.on("input", updateResult);
    updateResult();

  });
