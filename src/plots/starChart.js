/**
 * Star bar chart
 *
 * @author alex
 *
 */
import { nest } from 'd3-collection';
import * as d3 from 'd3';

/**
 * @param {*} data
 *
 * @author alex
 *
 * @since 9/28
 */
const makePlot = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = d3.select('#restaurant-map-star-chart').attr('class', 'restaurant-map-d3');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('My title');

  const grouped = nest()
    .key((d) => d.stars)
    .entries(data.filter((d) => d.stars))
    .sort((a, b) => a.key - b.key);

  console.log(grouped);
  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 30,
    bottom: 10,
    left: 50,
  };

  const svg = container.append('svg').attr('height', size.height).attr('width', size.width);

  //   container.append('a').text('Source: ___  _______').attr('href', '');

  /*
    Create Scales:
  */

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(grouped, (d) => d.values.length) - 1])
    .range([margin.left, size.width - margin.right]);

  const y = d3
    .scaleBand()
    .domain(grouped.map((k) => k.key))
    .range([margin.top, size.height - margin.bottom]);

  /*
    Start Plot:
  */

  const gs = svg
    .selectAll('g')
    .data(grouped)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(0, ${y(d.key)})`);

  gs.append('text')
    .text((d) => d.key)
    .attr('alignment-baseline', 'middle')
    .attr('y', y.bandwidth() / 2);

  gs.selectAll('circle')
    .data((d) => d.values)
    .enter()
    .append('circle')
    .attr('r', 15)
    .attr('fill', '#d3d3d3')
    .attr('cx', (d, i) => x(i))
    .attr('cy', y.bandwidth() / 2)
    .on('mouseenter', (event, d) => {
      console.log(d.name);
    });
};

export default makePlot;
