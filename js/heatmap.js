document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeHeatmap, 100);     // Giving pitch.js a moment to create the SVG
});

function initializeHeatmap() {
    const matchIds = [
        '3857300',  // Saudi Arabia (Group Stage)
        '3857289',  // Mexico (Group Stage)
        '3857264',  // Poland (Group Stage)
        '3869151',  // Australia (Round of 16)
        '3869321',  // Netherlands (Quarterfinal)
        '3869519',  // Croatia (Semifinal)
        '3869685'   // France (Final)
    ];

    const gridSize = {
        x: 12, // Number of horizontal cells
        y: 8,  // Number of vertical cells
    };

    // Calculating cell dimensions
    const cellWidth = 120 / gridSize.x;
    const cellHeight = 80 / gridSize.y;

    // Color scale for the heatmap
    const colorScale = d3.scaleSequential(d3.interpolateReds)
        .domain([0, 1]);

    const svg = d3.select('#pitch-viz svg g');


    if (!svg.node()) {
        console.error('Pitch SVG not found');
        return;
    }

    const heatmapGroup = svg.append('g')
        .attr('class', 'heatmap');


    // Creating initial grid cells
    const cells = [];
    for (let y = 0; y < gridSize.y; y++) {
        for (let x = 0; x < gridSize.x; x++) {
            cells.push({ x, y, value: 0 });
        }
    }

    // Data binding cells
    heatmapGroup.selectAll('.cell')
        .data(cells)
        .join('rect')
        .attr('class', 'cell')
        .attr('x', d => d.x * cellWidth)
        .attr('y', d => d.y * cellHeight)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', 'rgba(255, 0, 0, 0)')
        .attr('opacity', 0.5);

    // Function to update heatmap
    async function updateHeatmap(step) {
        const currentMatchId = matchIds[step];
            if (!currentMatchId) {
                console.error('No match ID found for step:', step);
                return;
            }
    
            try {
                const response = await fetch(`pressure_files/pressure_match_${currentMatchId}.json`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
        
                // Converting flat grid to 2D array
                const grid = Array.from({ length: gridSize.y }, () => new Array(gridSize.x).fill(0));
                data.forEach(d => {
                    grid[d.y][d.x] = d.value;
                });
        
                // Preparing for contours
                const values = grid.flat();
                const maxValue = d3.max(values);
                colorScale.domain([0, maxValue]);
                
                const contours = d3.contours()
                    .size([gridSize.x, gridSize.y])
                    .thresholds(d3.range(0.05, 1.01, 0.06))
                    (values);
        
                const pathGen = d3.geoPath(d3.geoIdentity()
                    .scale(cellWidth) // Scaling the grid to match pitch units
                    .translate([0, 0]));
        
                // Clearing previous contours
                heatmapGroup.selectAll('path').remove();
        
                // Drawing contours
                heatmapGroup.selectAll('path')
                    .data(contours)
                    .enter()
                    .append('path')
                    .attr('d', pathGen)
                    .attr('fill', d => colorScale(d.value))
                    .attr('stroke', 'none')
                    .attr('opacity', 0.7);
        
            } 
            catch (error) {
                console.error('Error loading/updating heatmap:', error);
                console.log('Failed to load data for match:', currentMatchId);
            }
    }

    // Initializing scrollama
    const scroller = scrollama();

    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(response => {
            updateHeatmap(response.index);
        })
        .onStepExit(response => {
            // Clearing the heatmap while exiting a step
            heatmapGroup.selectAll('.cell')
                .transition()
                .duration(500)
                .attr('fill', 'rgba(255, 0, 0, 0)');
        });

    // Loading first step initially
    updateHeatmap(0);

    //Resizing
    function handleResize() {
        scroller.resize();
    }

    window.addEventListener('resize', handleResize);
} 