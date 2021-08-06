import * as d3 from 'd3';

import './tableStyles.css';

const makeRestaurantTable = () => {
  const data = {
    name: 'Buddha Bowls',
    desc: 'Restaurant in IV',
    order: [
      {
        name: 'seamless.com',
        url: 'https://www.seamless.com/menu/buddha-bowls-901-embarcadero-del-mar-goleta/797998?utm_source=google&utm_medium=organic&utm_campaign=place-action-link',
      },
      {
        name: 'ubereats.com',
        url: 'https://www.ubereats.com/store/buddha-bowls/gkcVWhGeSvGQGwV9mInOSg/?utm_source=google&utm_medium=organic&utm_campaign=place-action-link',
      },
      {
        name: 'doordash.com',
        url: 'https://www.doordash.com/store/buddha-bowls-isla-vista-385983/?utm_campaign=gpa',
      },
      {
        name: 'grubhub.com',
        url: 'https://www.grubhub.com/restaurant/buddha-bowls-901-embarcadero-del-mar-goleta/797998?utm_source=google&utm_medium=organic&utm_campaign=place-action-link',
      },
      {
        name: 'postmates.com',
        url: 'https://www.postmates.com/store/buddha-bowls/gkcVWhGeSvGQGwV9mInOSg/?utm_source=google&utm_medium=organic&utm_campaign=place-action-link',
      },
    ],
    Menu: { url: 'https://www.buddhabowlsiv.com/new-page/' },
    phone_number: '(805) 961-4555',
    hours: [
      { day: 'Wednesday', time: '11AM\u20139PM' },
      { day: 'Thursday', time: '11AM\u20139PM' },
      { day: 'Friday', time: '11AM\u20139PM' },
      { day: 'Saturday', time: '11AM\u20139PM' },
      { day: 'Sunday', time: '11AM\u20139PM' },
      { day: 'Monday', time: '11AM\u20139PM' },
      { day: 'Tuesday', time: '11AM\u20139PM' },
    ],
    stars: '4.6',
    closed: null,
  };

  const container = d3.select('#restaurant-table');

  container.append('h1').attr('class', 'rest-name').text(data.name);

  container.append('p').attr('class', 'rest-desc').text(data.desc);

  container
    .append('table')
    .attr('class', 'restHourTable')
    .selectAll('hour-table')
    .data(data.hours)
    .enter()
    .append('tr')
    .selectAll('trow')
    .data((d) => [d.day, d.time])
    .enter()
    .append('td')
    .text((d) => d);

  container
    .append('div')
    .attr('class', 'buttonContainer')
    .append('a')
    .text('Menu')
    .attr('href', data.Menu.url)
    .attr('class', 'menuButton buttonLink');

  container
    .append('div')
    .attr('class', 'buttonContainer')
    .selectAll('.orderButton')
    .data(data.order)
    .enter()
    .append('a')
    .attr('class', 'orderButton buttonLink')
    .attr('href', (d) => d.url)
    .text((d) => d.name);

  console.log(d3.scaleOrdinal(d3.schemeTableau10).range());
};

export default makeRestaurantTable;
