const pol2car = (r, theta) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});

const rad2deg = (rad) => rad * (180 / Math.PI);
const roundTo = (mult) => (num) => Math.round(num * mult) / mult;
const shiftPoint = (point, x, y) => ({ x: point.x + x, y: point.y + y });
const roundPointTo = (mult) => (point) => ({
  x: roundTo(mult)(point.x),
  y: roundTo(mult)(point.x),
});

function calcPoints(config) {
  const { radius, segCount, segStartRadius } = config;

  const radPerSegment = (2 * Math.PI) / segCount;

  const segments = [];

  for (let i = 0; i < segCount; i++) {
    const theta = radPerSegment * i;
    const startPoint = pol2car(segStartRadius, theta);
    segments[i] = {
      left: roundTo(100)(startPoint.x + radius),
      top: roundTo(100)(startPoint.y + radius),
      angle: roundTo(100)(rad2deg(theta)),
    };
  }

  return segments;
}

function getRects(config) {
  const { radius, segCount, segStartRadius, segLength = 150 } = config;

  const radPerSegment = (2 * Math.PI) / segCount;

  const segments = [];

  for (let i = 0; i < segCount; i++) {
    const theta = radPerSegment * i;
    const startPoint = pol2car(segStartRadius, theta);
    const endPoint = pol2car(segStartRadius + segLength, theta);
    const vectorX = (endPoint.y - startPoint.y) / segLength;
    const vectorY = -(endPoint.x - startPoint.x) / segLength;

    segments[i] = {
      theta,
      rect: [
        shiftPoint(startPoint, radius, radius),
        shiftPoint(endPoint, radius, radius),
        shiftPoint(endPoint, vectorY + radius, vectorX + radius),
        shiftPoint(startPoint, vectorY + radius, vectorX + radius),
      ],
    };
  }

  return segments;
}

module.exports = {
  getSegments: calcPoints,
  getRects,
};
//
// console.log('Inner segments:');
// console.table(
//   getRects({
//     radius: 370,
//     segCount: 24,
//     segStartRadius: 25,
//   })
// );
//
// console.log('Outer segments:');
// console.table(
//   getRects({
//     radius: 370,
//     segCount: 48,
//     segStartRadius: 220,
//   })
// );
