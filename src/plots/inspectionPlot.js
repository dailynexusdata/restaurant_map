import * as d3 from 'd3';

const makeInspectionPlot = (data) => {
  const container = d3.select('#insepc-history');

  container.append('h1').text(data.name);

  const size = {
    height: 300,
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

  // get all of the unique descriptions - map data.insepcs to an array of just the descriptions
  const desc = ['No major violations', 'Hot and cold water available',
  'Hot and cold holding temperatures\nRodents, insects, birds or animals\nFood in good condition, safe and unadultered',
  'Rodents, insects, birds or animals\nHot and cold holding temperatures', 'Rodents, insects, birds or animals'];

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
    .attr('fill', 'blue') // for color
    .attr('fill-opacity', 0.1) // changes opacity
    .attr('cx', (d) => x(d.date)) // defines x-axis coordinate of a center point
    .attr('cy', y(0.5)) // defines y-axis coordinate of a center point
    .attr('r', 10); // defines the radius of circle
  
  // Other things to look at:
  const myArr = [1, 2, 3, 4, 5, 6];
  const squares = myArr.map(x => x ** 2); // use the array .map function to return an array squaring each number in myArr: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  console.log(squares);

  // use .filter() to get the even numbers out of myArr:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  const evens = myArr.filter(d => d % 2 == 0);
  console.log(evens);

  // compute the sum of all of the numbers in myArr using .reduce()
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
  // const sum = null;
  const sum = myArr.reduce((a, b) => a + b);
  console.log(sum)

  // console.log(sum);
  console.log(data)
};

export default makeInspectionPlot;
