// Set up dimensions
const width = 600;
const height = 400;

// Create SVG
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'white');

// Create hidden canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.style.display = 'none';
document.body.appendChild(canvas);

// Store dots globally
let dots = [];
let imageLoaded = false;

// Load image
const img = new Image();
img.onload = function() {
    // Scale image to fit
    const scale = Math.min(width / img.width, height / img.height) * 0.8;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Center image
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;
    
    // Process image
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    const imageData = context.getImageData(0, 0, img.width, img.height);
    
    for (let y = 0; y < imageData.height; y += 4) {
        for (let x = 0; x < imageData.width; x += 4) {
            const i = (y * imageData.width + x) * 4;
            const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            if (brightness < 128) {
                dots.push({
                    x: x * scale + offsetX,
                    y: y * scale + offsetY
                });
            }
        }
    }
    
    imageLoaded = true;
    // Initialize with scattered dots
    svg.selectAll('circle')
        .data(dots)
        .join('circle')
        .attr('r', 1.5)
        .attr('fill', 'black')
        .attr('cx', () => Math.random() * width)
        .attr('cy', () => Math.random() * height);
};
img.src = 'img/logo.jpg';

function updateChart(step, direction) {
    if (!imageLoaded) return;

    if (step === 1) {
        if (direction === 'down') {
            // Form image
            svg.selectAll('circle')
                .data(dots)
                .join('circle')
                .attr('r', 1.5)
                .attr('fill', 'black')
                .transition()
                .duration(1000)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        } else {
            // Scatter
            svg.selectAll('circle')
                .data(dots)
                .join('circle')
                .attr('r', 1.5)
                .attr('fill', 'black')
                .transition()
                .duration(1000)
                .attr('cx', () => Math.random() * width)
                .attr('cy', () => Math.random() * height);
        }
    }
} 

document.addEventListener("DOMContentLoaded", function () {
    const sliders = d3.selectAll("input[type='range']");
    const resultText = d3.select("#result");

    function updateResult() {
        const sum = Array.from(sliders.nodes()).reduce((acc, slider) => acc + +slider.value, 0);
        const result = Math.max(0, 10 - 0.3 * sum);
        resultText.text(result.toFixed(2));
    }

    sliders.on("input", updateResult);
    updateResult();
});
