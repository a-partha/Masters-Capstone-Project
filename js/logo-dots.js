// js/logo-dots.js
(() => {
  // 1) SVG dimensions
  const WIDTH  = 600;
  const HEIGHT = 400;

  // 2) Select your <svg id="logo-dot-viz">
  const svg = d3.select('#logo-dot-viz')
    .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // 3) Hidden canvas for pixel sampling
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');

  let dots  = [];
  let ready = false;

  // 4) Load & sample the image
  const img = new Image();
  img.src = 'img/logo.jpg';
  img.onload = () => {
    // draw full-size on our off-DOM canvas
    canvas.width  = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const pixels = ctx.getImageData(0, 0, img.width, img.height).data;

    // compute scale & centering
    const scale = Math.min(WIDTH / img.width, HEIGHT / img.height) * 0.8;
    const sw    = img.width  * scale;
    const sh    = img.height * scale;
    const offX  = (WIDTH  - sw) / 2;
    const offY  = (HEIGHT - sh) / 2;

    // sample every 4px for performance
    for (let y = 0; y < img.height; y += 12) {
      for (let x = 0; x < img.width; x += 12) {
        const i = 4 * (y * img.width + x);
        const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
        if (brightness < 200) {
          dots.push({
            x: x * scale + offX,
            y: y * scale + offY
          });
        }
      }
    }

    // done sampling—canvas was never appended to the DOM
    ready = true;

    // 5) initial hidden scatter, maroon fill
    svg.selectAll('circle')
      .data(dots)
      .join('circle')
        .attr('cx',   () => Math.random() * WIDTH)
        .attr('cy',   () => Math.random() * HEIGHT)
        .attr('r',    0)
        .attr('opacity', 0)
        .attr('fill', '#8d1b3d');
  };

  // 6) Animate dots in (“in”) or out (“out”)
  function animateDots(direction) {
    if (!ready) return;
    const sel = svg.selectAll('circle').data(dots);
    if (direction === 'in') {
      sel.transition().duration(2000)   // slower formation
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r',  1.5)
        .attr('opacity', 1);
    } else {
      sel.transition().duration(800)
        .attr('cx',   () => Math.random() * WIDTH)
        .attr('cy',   () => Math.random() * HEIGHT)
        .attr('r',    0)
        .attr('opacity', 0);
    }
  }

  // 7) Hook up Scrollama
  document.addEventListener('DOMContentLoaded', () => {
    const scroller = scrollama();
    scroller.setup({
      step:   '#logo-section .logo-step',
      offset: 1.0,
      debug:  false
    })
    .onStepEnter(() => animateDots('in'))               // form on scroll down
    .onStepExit(resp => {
      if (resp.direction === 'up') animateDots('out');  // disperse on scroll up
    });

    window.addEventListener('resize', () => scroller.resize());
  });
})();
