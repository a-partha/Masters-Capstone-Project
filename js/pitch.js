// Set up SVG
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const container = document.getElementById('pitch-viz');
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom;

// Create SVG
const svg = d3.select('#pitch-viz')
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

// Base 4-2-3-1 player positions (x, y in StatsBomb units)
const formationPositions = [
    // Back 4
    { x: 15, y: 20 },
    { x: 15, y: 35 },
    { x: 15, y: 45 },
    { x: 15, y: 60 },
  
    // Double pivot
    { x: 35, y: 30 },
    { x: 35, y: 50 },
  
    // Attacking mids / wingers
    { x: 55, y: 20 },
    { x: 55, y: 40 },
    { x: 55, y: 60 },
  
    // Striker
    { x: 80, y: 40 },
  ];
  
  // Create a group for formation circles
  const formationGroup = svg.append('g').attr('class', 'formation');
  
  // Add player circles (default hidden)
  formationGroup.selectAll('circle')
    .data(formationPositions)
    .enter()
    .append('circle')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', 2)
    .attr('fill', 'white')
    .attr('opacity', 0); // hidden until activated
  