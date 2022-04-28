const PI2 = Math.PI * 2;

const ipToNumber = (ip) =>
  ip.split('.').reduceRight((acc, num, i) => acc + (num << (8 * i)), 0);

const pol2car = (r, theta) => ({
  x: r * Math.cos(theta),
  y: r * Math.sin(theta),
});

const rad2deg = (rad) => rad * (180 / Math.PI);

const deg2rad = (deg) => deg * (Math.PI / 180);

const normalizeRad = (rad) => {
  while (rad >= PI2) rad -= PI2;
  while (rad < 0) rad += PI2;
  return rad;
};

const roundTo = (mult) => (num) => Math.round(num * mult) / mult;

const roundPointTo = (mult) => (point) => ({
  x: roundTo(mult)(point.x),
  y: roundTo(mult)(point.x),
});

const shiftPoint = (point, x, y) => ({ x: point.x + x, y: point.y + y });

const flipSegment = (segment) => {
  const [a, b, c, d] = segment.rect;
  return {
    ...segment,
    rect: [c, d, a, b],
    angle: normalizeRad(segment.angle + Math.PI),
  };
};

module.exports = {
  ipToNumber,
  pol2car,
  rad2deg,
  deg2rad,
  normalizeRad,
  roundTo,
  shiftPoint,
  roundPointTo,
  flipSegment,
};
