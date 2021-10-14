/**
 *
 * @author Alex
 *
 */
import {
  select,
  scaleLinear,
  range,
  scalePoint,
  max,
  area,
  curveBumpX,
  axisBottom,
  interpolateGreys,
  interpolateBlues,
  extent,
  scaleSequential,
  schemeGreys,
} from 'd3';

const expandHours = (hour) => {
  const [startHr, endHr] = hour.split('-');
  let [, startNum, startEnding] = startHr.match(/([\d:]*)(.*)/);
  const [, endNum, endEnding] = endHr.match(/([\d:]*)([AP]M)/);

  startEnding = startEnding === '' ? endEnding : startEnding;
  const interval = 1 / 4; // 15 min

  const startHour = 5.25;
  const labels = range(startHour, startHour + 21.75, interval).map((t) => {
    const ending = t % 24 >= 12 ? 'PM' : 'AM';
    let hr = t % 12;
    hr = hr === 0 ? 12 : hr;
    if (hr !== Math.floor(hr)) {
      const [h, m] = `${hr}`.split('.');
      hr = `${+h === 0 ? 12 : h}:${+`0.${m}` * 60}`;
    }

    return hr + ending;
  });

  const output = {};
  let include = false;
  labels.forEach((l) => {
    if (l === startNum + startEnding) {
      include = true;
    }
    output[l] = include ? 1 : 0;

    if (l === endNum + endEnding) {
      include = false;
    }
  });

  //   const available

  return output;
};

const stackHours = (hours) => {
  const order = [
    'starbucks',
    'deja vu',
    'Rosarito',
    'I.V. Drip',
    'pho bistro',
    "domino's pizza",

    'woodstocks',
    'super cuca',
    'buddha bowls',
    'freebirds',
    'bagel cafe',
    'naan stop',
    'sizzling lunch',
    'hana kitchen',
    'rockfire grill',
    'caje',
    'blenders in the grass',
    "Sam's To Go",
    'Spudnuts',
    'Sushiya Express',
    'mojo asian',
    'Pizza My Heart',
    'PokeCeviche',
    'Lao Wang',
    "dublin's sports grill",
  ];

  const cum = {};
  Object.keys(hours[0].expanded).forEach((k) => {
    cum[k] = 0;
  });

  return order.map((o) => {
    const obj = hours.find((d) => d.name === o);
    obj.values = [];

    Object.entries(obj.expanded).forEach(([key, val]) => {
      obj.values.push([cum[key], cum[key] + val]);
      obj.values[obj.values.length - 1].x = key;
      cum[key] += val;
    });

    return obj;
  });
};

/**
 * @param {*} data - What is the data?
 *
 * @author Alex
 *
 * @since 9/27/2021
 */
const makePlot = (data) => {
  /*
    Container Setup:
  */

  // The class is necessary to apply styling
  const container = select('#restaurant-map-hours-stacked').attr('class', 'restaurant-map-d3');

  // When the resize event is called, reset the plot
  container.selectAll('*').remove();

  container.append('h1').text('My title');

  const size = {
    height: 500,
    width: Math.min(800, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 15,
    bottom: 30,
    left: 15,
  };
  const hoverArea = container.append('div');

  const svg = hoverArea.append('svg').attr('height', size.height).attr('width', size.width);

  container.append('a').text('Source: __________').attr('href', '');

  /*
    Start Plot:
  */
  const fridays = data
    .filter((d) => d.closed === null || d.closed === undefined)
    .map((d) => ({ ...d, hours: d.hours.find((h) => h.day === 'Friday') }))
    .map((d) => ({ ...d, expanded: expandHours(d.hours.time) }));

  // earliest
  // console.log(
  //   fridays
  //     .map((d) => ({
  //       ...d,
  //       earliest: Object.entries(d.expanded)
  //         .map((d, i) => {
  //           d.i = i;
  //           return d;
  //         })
  //         .find((d) => d[1] === 1),
  //     }))
  //     .sort((a, b) => a.earliest.i - b.earliest.i),
  // );

  // latest;
  console.log(
    fridays
      .map((d) => ({
        ...d,
        latest: Object.entries(d.expanded)
          // .reverse()
          .map((d, i) => {
            d.i = i;
            return d;
          })
          .find((d) => +d[1] === 1),
      }))
      .filter((d) => d.latest[0] === '11AM'),
    // .sort((a, b) => a.latest.i - b.latest.i),
  );

  // console.log(
  //   fridays
  //     .map((d) => ({
  //       ...d,
  //       earliest: Object.entries(d.expanded)
  //         .map((d, i) => {
  //           d.i = i;
  //           return d;
  //         })
  //         .filter((d) => d[1] === 1),
  //     }))
  //     .sort((a, b) => a.earliest.length - b.earliest.length),
  // );

  const stacked = stackHours(fridays);
  // console.log(stacked);
  /*
    Create Scales:
  */
  const y = scaleLinear()
    .domain([0, max(stacked[stacked.length - 1].values, (d) => d[1])])
    .range([size.height - margin.bottom, margin.top]);

  // console.log(stacked[stacked.length - 1].values.map((d) => d.x));

  const x = scalePoint()
    .domain(stacked[stacked.length - 1].values.map((d) => d.x))
    .range([margin.left, size.width - margin.right]);

  const timeArea = area()
    .x((d) => x(d.x))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveBumpX);

  const timePath = area()
    .x((d) => x(d.x))
    .y((d) => y(d[1]))
    .curve(curveBumpX);
  // console.log('GRAY SCALE');
  // console.log(stacked.map((d, i) => d.name));
  // console.log(grayScale.domain());
  // console.log(grayScale.range());

  const color = (rest, i) => {
    if (rest === 'Rosarito') {
      return '#4E79A7';
    }
    if (rest === 'deja vu') {
      return '#E15759';
    }
    if (rest === 'starbucks') {
      return '#00643C';
    }
    if (rest === "dublin's sports grill") {
      return '#005AA3';
    }
    return interpolateGreys(1 - i / 24);
  };

  svg
    .selectAll('path')
    .data(stacked)
    .enter()
    .append('path')
    .attr('fill', (d, i) => color(d.name, i))
    .on('mousemove', (event, d) => {
      console.log(d.name, d);
    })
    .attr('d', (d) => timeArea(d.values));
  console.log(stacked.slice(-1));
  svg
    .selectAll('outline')
    .data(stacked.slice(-1))
    .enter()
    .append('path')
    .attr('stroke', '#00002b44')
    .attr('stroke-width', 1)
    // .attr('fill', 'none')
    .attr('d', (d) => timePath(d.values));

  // console.log(x.domain().filter((d) => d.length <= 4));

  svg
    .append('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(
      axisBottom()
        .scale(x)
        .tickValues(x.domain().filter((d) => d.length <= 4))
        .tickFormat((d, i) => (i % 2 === 0 ? d : '')),
    );

  const labels = svg.append('g');

  labels
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'restaurant-map-d3-triangle2')
    .attr('refX', 4)
    .attr('refY', 2)
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 4 0 0 2 4 4')
    .attr('fill', '#005AA3');

  labels
    .append('path')
    .attr(
      'd',
      `M ${x('9PM') + 15} ${y(22)} Q ${x('9PM') + 45} ${y(22) + 15}, ${x('9PM') + 75} ${
        y(22) - 10
      }`,
    )
    .attr('fill', 'none')
    .attr('stroke', '#005AA3')
    .attr('stroke-width', 2)
    .attr('marker-start', 'url(#restaurant-map-d3-triangle2)');
};

export default makePlot;
