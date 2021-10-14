import * as d3 from 'd3';

function D3Star() {
  // https://bl.ocks.org/Lulkafe/77fbdf8bfdb443218121bcaf44609425
  let size = 2;
  let x = 0;
  let y = 0;
  let value = 1.0; // Range is 0.0 - 1.0
  let borderWidth = 3;
  let borderColor = 'black';
  let starColor = '#FFB500';
  let backgroundColor = 'white';

  function star(selection) {
    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y);
    const rad = function (deg) {
      return (deg * Math.PI) / 180;
    };
    const cos = function (deg) {
      return Math.cos(rad(deg));
    };
    const sin = function (deg) {
      return Math.sin(rad(deg));
    };
    const tan = function (deg) {
      return Math.tan(rad(deg));
    };
    const n = size;
    const m = n / 2;
    const h = m * tan(36);
    const k = h / sin(72);

    // (x, y) points at the leftmost point of the star, not the center
    const coordinates = [
      { x, y },
      { x: x + k, y },
      { x: x + m, y: y - h },
      { x: x + n - k, y },
      { x: x + n, y },
      { x: x + n - k * cos(36), y: y + k * sin(36) },
      { x: x + n * cos(36), y: y + n * sin(36) },
      { x: x + m, y: y + h },
      { x: x + n - n * cos(36), y: y + n * sin(36) },
      { x: x + k * cos(36), y: y + k * sin(36) },
    ];

    // inside star
    selection
      .append('path')
      .attr('d', line(coordinates))
      .style('stroke-width', 0)
      .style('fill', starColor);

    // Rect for clipping
    // In order to avoid potential ID duplicates for clipping, clip-path is not used here
    // selection
    //   .append('rect')
    //   .attr('x', x + size * value)
    //   .attr('y', y - h)
    //   .attr('width', size - size * value)
    //   .attr('height', size)
    //   .style('fill', backgroundColor);

    // border of the star
    // selection
    //   .append('path')
    //   .attr('d', line(coordinates))
    //   .style('stroke-width', borderWidth)
    //   .style('fill', 'none')
    //   .style('stroke', borderColor);
  }

  star.x = function (val) {
    x = val;
    return star;
  };

  star.y = function (val) {
    y = val;
    return star;
  };

  star.size = function (val) {
    size = val;
    return star;
  };

  // Range is 0.0 - 1.0. 0.0 shows, for example, an empty star
  star.value = function (val) {
    value = val;
    return star;
  };

  star.backgroundColor = function (val) {
    backgroundColor = val;
    return star;
  };

  star.borderWidth = function (val) {
    borderWidth = val;
    return star;
  };

  star.borderColor = function (val) {
    borderColor = val;
    return star;
  };

  star.starColor = function (val) {
    starColor = val;
    return star;
  };

  star.isBorderRounded = function (val) {
    isBorderRounded = val;
    return star;
  };

  return star;
}

export default D3Star;
