import { range } from 'd3';
import D3Star from './star';

const StarArea = (g, val, name) => {
  const height = 15;
  const margin = {
    top: 5,
    bottom: 5,
    left: 0,
    right: 0,
  };
  const distance = height + 2;

  //   console.log({ val, d: distance * val });

  const size = {
    width: margin.left + margin.right + distance * val - 1,
    height: height + margin.top + margin.bottom,
  };

  const svg = g
    .attr('width', size.width)
    .attr('height', size.height)
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height)
    .attr('val', val)
    .attr('name', name);

  //   console.log({ val, range: range(0, val, 1) });

  svg
    .selectAll('stars')
    .data(
      range(0, val, 1).map((d, i) => ({
        x: i * distance + margin.left,
        y: height / 2 + margin.top,
      })),
    )
    .enter()
    .each((d, i) => {
      //   console.log({ d, i });
      const star = new D3Star();
      const prop = Math.max(Math.min(val - i, 1), 0);
      star.x(d.x).y(d.y).size(height).value(prop)
        .starColor('#F0CF4C')
        .borderWidth(0);

      svg.call(star);
    });

  return [svg, size];
};

export default StarArea;
