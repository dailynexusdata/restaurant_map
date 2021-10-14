import * as d3 from 'd3';

/**
 * @todo filter restaurants by selected options
 */
const cname = 'delivery-order-menu-selected';
const buttonClass = 'delivery-order-menu-buttons';

const updatePlot = (container, data, udpateFunc) => {
  const unique = [
    ...new Set(
      data
        .map((d) => d.order)
        .filter((a) => a)
        .reduce((a, b) => [...a, ...b])
        .map((d) => d.name),
    ),
  ];

  console.log(unique);

  container
    .selectAll(`.${buttonClass}`)
    .data(unique)
    .enter()
    .append('button')
    .attr('class', buttonClass)
    .text((d) => d)
    // add button styling
    .style('background-color', 'white')
    .style('border', '1px solid black')
    .on('click', function () {
      const selectedButton = d3.select(this);
      const isSelected = selectedButton.attr('class').includes(cname);

      selectedButton.attr(
        'class',
        isSelected ? buttonClass : `${buttonClass} ${cname}`,
      );

      // style selectedButton to show its selected

      udpateFunc();
    });
};

const updateSelection = (container, data) => () => {
  const selectedOptions = container
    .selectAll('.delivery-order-menu-buttons')
    .filter(function () {
      return d3.select(this).attr('class').includes(cname);
    })
    .data();

  // this is an array of the selected buttons:
  // filter out data with this array
  console.log(selectedOptions);
};

const makePlot = (data) => {
  const container = d3.select('#menu-selection');

  updatePlot(container, data, updateSelection(container, data));
};

export default makePlot;
