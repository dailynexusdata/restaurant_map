import * as d3 from 'd3';

const makeInspectionPlot = (data) => {
  const container = d3.select('#insepc-history');

  container.append('h1').text(data.name);

  const size = {
    height: 200,
    width: 600,
  };
  const margin = {
    left: 10,
    top: 10,
    right: 10,
    bottom: 10,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  const x = d3
    .scaleTime()
    .domain(d3.extent(data.inspecs, (d) => d.date))
    .range([margin.left, size.width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([size.height - margin.top, margin.bottom]);

  //   const line = d3
  //     .line()
  //     .x((d) => {
  //       console.log(d, x(d.date));
  //       return x(d.date);
  //     })
  //     .y(y(0.5));

  //   svg
  //     .datum(data.inspecs)
  //     .append('path')
  //     .attr('d', line)
  //     .attr('stroke', 'black')
  //     .attr('stroke-width', 2);

  svg
    .selectAll('inspecCircles')
    .data(data.inspecs)
    .enter()
    .append('circle')
    .attr('fill', 'green')
    .attr('cx', (d) => x(d.date))
    .attr('cy', y(0.5))
    .attr('r', 2);
};

export default makeInspectionPlot;
