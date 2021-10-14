import * as d3 from 'd3';

/**
 * @todo hour frequency plot
 * @todo filter restaurants by hours
 */

const convertTimeToMilitry = (time) => {
  // write this function
  // should return a number like 6 or 14.5 for half hour
};

const timeBins = (data) => {
  const output = data.map(({ time }) => {
    const [start, end] = time.split('–');

    //  may need to add AM/PM when missing
    console.log(start, end);

    const startingHour = convertTimeToMilitry(start);
    const endingHour = convertTimeToMilitry(start);

    return d3.range(startingHour, endingHour, 0.5);
  });

  console.log(output);

  // this is the format of the output
  return [
    [0, 0.5, 1, 1.5],
    [3, 3.5, 4],
    [12, 12.5, 13, 13.5],
    [12.5, 13],
  ];
};

const makePlot = (data) => {
  const container = d3.select('#hour-selection');

  const size = {
    height: 100,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 10,
    bottom: 30,
    left: 10,
  };

  const svg = container
    .append('svg')
    .attr('height', size.height)
    .attr('width', size.width);

  const hours = data
    .map((d) => d.hours)
    .filter((d) => d)
    .reduce((a, b) => [...a, ...b]);

  const days = [
    { abbr: 'S', name: 'Sunday' },
    { abbr: 'M', name: 'Monday' },
    { abbr: 'T', name: 'Tuesday' },
    { abbr: 'W', name: 'Wednesday' },
    { abbr: 'Th', name: 'Thursday' },
    { abbr: 'F', name: 'Friday' },
    { abbr: 'S', name: 'Saturday' },
  ];

  const todayIdx = new Date().getDay();
  const today = days.find((_, i) => i === todayIdx);

  const todayHours = hours.filter(
    (d) => d.day.replace(/\(.*\)/, '') === today.name,
  );

  const x = d3
    .scaleLinear()
    .domain([0, 24])
    .range([margin.left, size.width - margin.right]);

  svg
    .append('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(d3.axisBottom().scale(x));

  const binData = timeBins(todayHours).reduce((a, b) => [...a, ...b]);

  const binned = d3
    .bin()
    .value((d) => d)
    .domain(x.domain())
    .thresholds(d3.range(0, 24, 0.5))(binData);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(binned, (d) => d.length)])
    .range([size.height - margin.bottom, margin.top]);

  svg
    .selectAll('bars')
    .data(binned)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.x0))
    .attr('width', (d) => x(d.x1) - x(d.x0))
    .attr('y', (d) => y(d.length))
    .attr('height', (d) => size.height - margin.bottom - y(d.length));

  console.log(filterSelectedTime(data, [6, 12]));
};

const filterSelectedTime = (data, timeRange) => {
  // get all of the restaurants open in a timeRange
  // time range is like [6, 12]
  //   console.log(data);
};

export default makePlot;
