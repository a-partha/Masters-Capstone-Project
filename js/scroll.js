// Create an Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const step = parseInt(entry.target.dataset.step);
            // We'll handle updates through scrollama instead
        }
    });
}, {
    threshold: 0.7  // Increased threshold so animation starts when text is more visible
});

// Observe all step elements
document.querySelectorAll('.step').forEach(step => {
    observer.observe(step);
});

// Generic window resize listener event
function handleResize() {
    // Update dimensions and positions if needed
    scrollerHeatmap.resize();
    scrollerStack.resize();
}

// Initialize scrollama
const scrollerHeatmap = scrollama();
const scrollerStack = scrollama();


// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    d3.selectAll('.step').classed('active', false);
    d3.select(response.element).classed('active', true);
}

// Create a more aggressive resize observer
const resizeObserver = new ResizeObserver(() => {
    scrollerHeatmap.resize();
    scrollerStack.resize();
});

resizeObserver.observe(document.querySelector('#scrolly'));

// Initialize scrollama
function initScroll() {
    // Setup the instance, pass callback functions
    scrollerHeatmap

        .setup({
            step: '.step',
            offset: 0.5,
            debug: false
        })
        .onStepEnter(handleStepEnter);

    // For scroll-stack text steps
    console.log("scrollerStack", scrollerStack);
    console.log("typeof scrollerStack.setup", typeof scrollerStack.setup);
    scrollerStack
    
        .setup({
            
            step: '.scroll-step',
            offset: 0.8,
            debug: false
        })
        .on('enter', function (response) {
            d3.select(response.element).classed('is-active', true);
            d3.select(response.element).classed('visible', true);
        })
        .on('exit', function (response) {
            d3.select(response.element).classed('visible', false);
        });

        window.addEventListener('resize', () => {
            scrollerHeatmap.resize();
            scrollerStack.resize();
    });
}

// Start it up
initScroll(); 

