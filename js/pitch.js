const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const container = document.getElementById('pitch-viz');
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom;

// Creating the SVG
const svg = d3.select('#pitch-viz')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 120 80`)
    .append('g');

// Drawing the pitch outline
svg.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 120)
    .attr('height', 80)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the center line
svg.append('line')
    .attr('x1', 60)
    .attr('y1', 0)
    .attr('x2', 60)
    .attr('y2', 80)
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the center circle
svg.append('circle')
    .attr('cx', 60)
    .attr('cy', 40)
    .attr('r', 9.15)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the center dot
svg.append('circle')
    .attr('cx', 60)
    .attr('cy', 40)
    .attr('r', 0.5)
    .attr('fill', 'white');

// Drawing the left penalty box
svg.append('rect')
    .attr('x', 0)
    .attr('y', 18)
    .attr('width', 18)
    .attr('height', 44)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the right penalty box
svg.append('rect')
    .attr('x', 102)
    .attr('y', 18)
    .attr('width', 18)
    .attr('height', 44)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the left 6-yard box
svg.append('rect')
    .attr('x', 0)
    .attr('y', 30)
    .attr('width', 6)
    .attr('height', 20)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the right 6-yard box
svg.append('rect')
    .attr('x', 114)
    .attr('y', 30)
    .attr('width', 6)
    .attr('height', 20)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the left goal post
svg.append('rect')
    .attr('x', 0)
    .attr('y', 36)
    .attr('width', 1)
    .attr('height', 8)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the right goal post
svg.append('rect')
    .attr('x', 119)
    .attr('y', 36)
    .attr('width', 1)
    .attr('height', 8)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the penalty spots
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

// Function to create the arc path
function createArcPath(startAngle, endAngle) {
    return d3.arc()
        .innerRadius(9.15)
        .outerRadius(9.15)
        .startAngle(startAngle)
        .endAngle(endAngle);
}

// Drawing the left penalty arc
svg.append('path')
    .attr('d', createArcPath(0.25 * Math.PI, 0.75 * Math.PI)())
    .attr('transform', `translate(12,40)`)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3);

// Drawing the right penalty arc
svg.append('path')
    .attr('d', createArcPath(-0.75 * Math.PI, -0.25 * Math.PI)())
    .attr('transform', `translate(108,40)`)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.3); 

// Players in the 4-2-3-1 formation
const formationPositions = [
    // Back 4
    { x: 15, y: 20 },
    { x: 15, y: 35 },
    { x: 15, y: 45 },
    { x: 15, y: 60 },
  
    // Double pivot midfield
    { x: 35, y: 30 },
    { x: 35, y: 50 },
  
    // Attacking midfielders / wingers
    { x: 55, y: 20 },
    { x: 55, y: 40 },
    { x: 55, y: 60 },
  
    // Striker
    { x: 80, y: 40 },
  ];
  
  const formationGroup = svg.append('g').attr('class', 'formation');
  
// Adding player circles
formationGroup.selectAll('circle')
    .data(formationPositions)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 2)
    .attr('fill', 'white')
    .attr('opacity', 0);
  