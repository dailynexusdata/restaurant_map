import * as d3 from 'd3';
import * as L from 'leaflet';
import GetMap from './getMapClass';
import 'leaflet/dist/leaflet.css';
import StarSection from './starSection';

const wait = async (timeSleep) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, timeSleep);
});

const makePlot = (restaurants) => {
  const container = d3.select('#restaurant-map');

  const size = {
    height: 800,
    width: Math.min(800, window.innerWidth - 40),
  };

  container
    .append('div')
    .attr('id', 'restaurant-delivery-map')
    .style('height', `${size.height}px`)
    .style('width', `${size.width}px`);

  const [map, svg] = new GetMap(
    'restaurant-delivery-map',
    true,
    [34.41226370342688, -119.85621571540833],
    17,
    { zoomControl: false },
  );

  const topRests = ['buddha bowls', 'woodstocks', 'habit', 'freebirds'];

  const update = () => {
    svg.selectAll('*').remove();
    restaurants
      .sort((a, b) => (topRests.includes(a) ? 1 : topRests.includes(b) ? 1 : -1))
      .filter((d) => d.lat)
      .forEach((rest) => {
        const height = topRests.includes(rest.name) ? 60 : Math.random() * 15 + 30;

        const ll = new L.latLng(rest.lat, rest.lng);
        const x = map.latLngToLayerPoint(ll).x - height / 2;
        const y = map.latLngToLayerPoint(ll).y - height;
        console.log(rest);

        const href = topRests.includes(rest.name)
          ? `dist/img/${rest.name}.png`
          : `dist/img/random${Math.round(Math.random())}.png`;

        const r = svg
          .append('image')
          .attr('x', x)
          .attr('y', y)
          .style('width', `${height}px`)
          .style('height', `${height}px`)
          .attr('xlink:href', href)
          .attr('pointer-events', 'visible');

        if (rest.stars) {
          console.log('HEREREREAASDs');
          const starG = svg.append('foreignObject');
          console.log(rest.stars);
          const [starSvg, starSize] = StarSection(starG, +rest.stars, rest.name);
          starG.attr(
            'transform',
            `translate(${map.latLngToLayerPoint(ll).x - starSize.width / 2}, ${
              y - starSize.height + 5
            })`,
          );
          starG.raise();
        }
        r.on('click', (event, d) => {
          const [x, y] = d3.pointer(event);
          console.log('clicked');

          // r.attr('x', x);
          // r.attr('y', y);

          map.dragging.disable();
        });

        r.on('mouseenter', async () => {
          console.log(rest.name);
          const playing = true;
          let i = 0;
          const timeSleep = 5;
          for (; i < 5; ++i) {
            r.attr('y', y + i);
            await wait(timeSleep);
          }
          for (; i > -5; --i) {
            r.attr('y', y + i);
            await wait(timeSleep);
          }
          for (; i <= 0; ++i) {
            r.attr('y', y + i);
            await wait(timeSleep);
          }
        });
      });
  };

  map.on('moveend', update);
  map.on('click', (d) => {
    console.log(d.latlng);
  });
  update();
};

export default makePlot;
