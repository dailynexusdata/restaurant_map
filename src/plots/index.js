/**
 * @file
 * @author
 * @since
 */
import './styles.scss';
import * as d3 from 'd3';
import { nest } from 'd3-collection';

// import other files here
import makeRestaurantTable from './table';
import makeInspectionPlot from './inspectionPlot';
import makeStars from './stars';
import makeMap from './map';

import makeDeliverySelection from './deliverySelection';
import makeHourSelection from './hourSelection';
import makeStarChart from './starChart';

import makeHoursStacked from './hoursStacked';

(async () => {
  // Import JSON file
  const timeParse = d3.timeParse('%m/%d/%Y');
  const healthData = (await d3.json('dist/data/test.json')).map(({ name, inspecs }) => ({
    name,
    inspecs: inspecs.map(({ date, desc }) => ({
      date: timeParse(date),
      desc,
    })),
  }));
  const data = await d3.json('dist/data/status.json');

  console.log(data);

  const resize = () => {
    // call functions here with data
  };

  window.addEventListener('resize', () => {
    resize();
  });

  makeRestaurantTable();
  makeInspectionPlot(healthData[0]);
  makeStars();
  makeMap(data);

  console.log(
    nest()
      .key((d) => +d.stars)
      .entries(data),
  );

  makeDeliverySelection(data);
  makeHourSelection(data);
  makeHoursStacked(data);
  makeStarChart(data);

  resize();
})();
