const fs = require('fs');

const rests = JSON.parse(fs.readFileSync('dist/data/status.json', 'utf-8'));

console.log('N restaurants', rests.length);

const stars = rests.map((d) => +d.stars).filter((d) => d);

console.log('N stars', stars.length);

console.log('Avg stars', stars.reduce((a, b) => a + b) / stars.length);

console.log(
  'min stars',
  stars.reduce((a, b) => Math.min(a, b)),
);

console.log(
  'max stars',
  stars.reduce((a, b) => Math.max(a, b)),
);
