import * as d3 from 'd3';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const restaurants = [
  {
    name: 'freebirds',
    label: 'woodstock',
    lat: '34.41218902131045',
    lng: '-119.85517501831055',
  },
  { name: 'freebirds', lat: '34.4131939050892', lng: '-119.8556685447693' },
  { name: 'habit', lat: '34.413185053977315', lng: '-119.8550918698311' },
  {
    name: 'buddhabowls',
    lat: '34.412895179545664',
    lng: '-119.85719472169878',
  },
  {
    name: 'freebirds',
    label: 'iv bagel',
    lat: '34.410967820946304',
    lng: '-119.85706061124803',
  },
  {
    name: 'freebirds',
    label: 'iv bagel',
    lat: '34.412844008859445',
    lng: '-119.85780358314516',
  },
  {
    lat: '34.413187266755365',
    lng: '-119.85479146242143',
    name: 'freebirds',
  },
  { name: 'freebirds', lat: '34.41158077447897', lng: '-119.85634446144105' },
];

const simpleMap = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  },
);
const satelliteMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
);

const makePlot = () => {
  const container = d3.select('#restaurant-map');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  container
    .append('div')
    .attr('id', 'restaurant-delivery-map')
    .style('height', `${size.height}px`)
    .style('width', `${size.width}px`);

  const map = L.map('restaurant-delivery-map').setView(
    [34.41226370342688, -119.85621571540833],
    17,
  );

  map.addLayer(simpleMap);
  L.svg().addTo(map);
  //   document.getElementById('changeMap').addEventListener('change', (e) => {
  //     const val = e.target.value;
  //     if (val === 'on') {
  //       mymap.removeLayer(simpleMap);
  //       mymap.addLayer(satelliteMap);
  //     } else {
  //       mymap.removeLayer(satelliteMap);
  //       mymap.addLayer(simpleMap);
  //     }
  //     e.target.value = val === 'on' ? 'off' : 'on';
  //   });

  const overlay = d3.select(map.getPanes().overlayPane);
  const svg = overlay.select('svg');

  const height = 50;
  const update = () => {
    svg.selectAll('image').remove();
    restaurants.forEach((rest) => {
      const ll = new L.latLng(rest.lat, rest.lng);
      const x = map.latLngToLayerPoint(ll).x - height / 2;
      const y = map.latLngToLayerPoint(ll).y - height;
      const r = svg
        .append('image')
        .attr('x', x)
        .attr('y', y)
        .style('width', `${height}px`)
        .style('height', `${height}px`)
        .attr('xlink:href', `dist/img/${'buddhabowls'}.png`)
        .attr('pointer-events', 'visible');

      r.on('click', (event, d) => {
        const [x, y] = d3.pointer(event);
        console.log('clicked');

        // r.attr('x', x);
        // r.attr('y', y);

        map.dragging.disable();
      });

      r.on('mouseenter', async () => {
        // console.log(rest.name);
        const playing = true;

        // await new Promise((resolve) => {
        // const interval = setInterval(async () => {
        let i = 0;
        const timeSleep = 5;
        for (; i < 5; ++i) {
          r.attr('y', y + i);

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, timeSleep);
          });
        }
        for (; i > -5; --i) {
          r.attr('y', y + i);

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, timeSleep);
          });
        }
        for (; i <= 0; ++i) {
          r.attr('y', y + i);

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, timeSleep);
          });
        }
      });
    });
  };

  map.on('moveend', update);
  update();
};

export default makePlot;
