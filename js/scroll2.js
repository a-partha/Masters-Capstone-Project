let chartVisible = false;
let stackInitialized = false; // to prevent multiple calls

function setupScrollStack() {
  scrollerStack.setup({
    step: '.scroll-step',
    offset: 0.8,
    debug: false
  })
  .onStepEnter(response => {
    d3.select(response.element).classed('is-active', true);
  })
  .onStepExit(response => {
    if (response.direction === 'up') {
      d3.select(response.element).classed('is-active', false);
    }
  });
}

// Observe when the chart is fully visible
const plotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio === 1 && !stackInitialized) {
      chartVisible = true;
      stackInitialized = true;

      // Setup scroll stack only once
      setupScrollStack();
      document.querySelector('.scroll-stack')?.classList.remove('stack-disabled');
      
    }
   

  });
}, { threshold: 1.0 });


plotObserver.observe(document.querySelector(".plot-anchor"));


// Initialize scrollama instances
const scrollerHeatmap = scrollama();
const scrollerStack = scrollama();

// Heatmap step enter handler
function handleStepEnter(response) {
    d3.selectAll('.step').classed('active', false);
    d3.select(response.element).classed('active', true);
}

// Initialize scroll logic
function initScroll() {
    // Set up heatmap scroll
    scrollerHeatmap.setup({
        step: '.step',
        offset: 0.5,
        debug: false
    });

    scrollerHeatmap.onStepEnter(handleStepEnter);

    // // Set up stacked text scroll
    // scrollerStack.setup({
    //     step: '.scroll-step',
    //     offset: 0.8,
    //     debug: false
    // });

    // scrollerStack.onStepEnter(response => {
    //     if (chartVisible && !d3.select(response.element).classed('is-active')) {
    //         d3.select(response.element).classed('is-active', true);
    //         d3.select(response.element).classed('visible', true);
    //     }
    // });

    // scrollerStack.onStepExit(response => {
    //     if (chartVisible && !d3.select(response.element).classed('is-active')) {
    //     d3.select(response.element)
    //         .classed('is-active', true)
    //         .classed('visible',true);
    //     }
    // });


    scrollerStack.setup({
        step: '.scroll-step',
        offset: 0.8,
        debug: false
    })
    .onStepEnter(response => {
        if (chartVisible) {
            d3.select(response.element).classed('is-active', true);
        }
    })
    .onStepExit(response => {
        if (chartVisible && response.direction === 'up') {
            d3.select(response.element).classed('is-active', false);
        }
    });
    
    // Resize handlers
    window.addEventListener('resize', () => {
        scrollerHeatmap.resize();
        scrollerStack.resize();
    });
}

// Start
initScroll();
