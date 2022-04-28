const { normalizeRad, pol2car, shiftPoint, deg2rad } = require('./utils');

function placeByCircle(config) {
  const { radius, count, startRadius, width, height = 1, shiftAngle = 0 } = config;

  const radPerSegment = (Math.PI * 2) / count;

  const segments = [];

  for (let i = 0; i < count; i++) {
    const theta = normalizeRad(radPerSegment * i + deg2rad(shiftAngle));
    const startPoint = pol2car(startRadius, theta);
    const endPoint = pol2car(startRadius + width, theta);
    const vectorX = ((endPoint.y - startPoint.y) / width) * height;
    const vectorY = (-(endPoint.x - startPoint.x) / width) * height;

    segments[i] = {
      angle: theta,
      config,
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
  placeByCircle,
};
