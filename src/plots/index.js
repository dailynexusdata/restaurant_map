/**
 * @file
 * @author
 * @since
 */
import './styles.scss';
import * as d3 from 'd3';

// import other files here
import makeRestaurantTable from './table';
import makeInspectionPlot from './inspectionPlot';

(async () => {
  // Import JSON file
  const timeParse = d3.timeParse('%m/%d/%Y');
  const data = (await d3.json('dist/data/test.json')).map(
    ({ name, inspecs }) => ({
      name,
      inspecs: inspecs.map(({ date, desc }) => ({
        date: timeParse(date),
        desc,
      })),
    }),
  );

  const resize = () => {
    // call functions here with data
  };

  window.addEventListener('resize', () => {
    resize();
  });

  makeRestaurantTable();
  makeInspectionPlot(data[0]);

  resize();
})();
