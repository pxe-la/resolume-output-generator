const fs = require('fs');
const tal = require('template-tal');
const nanoid = require('nanoid');

const { placeByCircle } = require('./placeByCircle');
const { ipToNumber, flipSegment } = require('./utils');

const indexRemap = {
  25: 55,
  4: 3,
  3: 4,
};

const getDevice = (segment, config) => ({
  pixelCount: config.pixelCount,
  chanel: config.channel,
  angle: segment.angle,
  rect: segment.rect,
});

const outerScreens = placeByCircle({
  radius: 370,
  count: 72,
  startRadius: 25 + 150 + 45,
  width: 150,
})
  .map((segment, i) => (i % 2 === 0 ? segment : flipSegment(segment)))
  .reduce((acc, segment, i, arr) => {
    if (i % 2) return acc;
    acc.push([arr[i], arr[i + 1]]);
    return acc;
  }, [])
  .map((segmentGroup, i) => {
    const index = indexRemap[i] || i;
    return {
      id: index,
      name: `Outer ${i}`,
      ip: `TT_IP\n${ipToNumber(`2.0.0.${Math.floor(index / 4) + 2}`)}`,
      universe: index % 16,
      subnet: Math.floor(index / 16),
      devices: [
        getDevice(segmentGroup[0], { pixelCount: 80, channel: 1 }),
        getDevice(segmentGroup[1], { pixelCount: 80, channel: 241 }),
      ],
    };
  });

const innerScreens = placeByCircle({
  radius: 370,
  count: 24,
  startRadius: 25,
  width: 150,
})
  .reduce((acc, segment, i, arr) => {
    if (i >= arr.length / 2) return acc;
    acc.push([arr[i], arr[i + arr.length / 2]]);
    return acc;
  }, [])
  .map((segmentGroup, i) => {
    let index = i + 36;
    index = indexRemap[index] || index;
    return {
      id: index,
      name: `Inner ${i}`,
      ip: `TT_IP\n${ipToNumber(`2.0.0.${Math.floor(index / 4) + 2}`)}`,
      universe: index % 16,
      subnet: Math.floor(index / 16),
      devices: [
        getDevice(segmentGroup[0], { pixelCount: 85, channel: 1 }),
        getDevice(segmentGroup[1], { pixelCount: 85, channel: 256 }),
      ],
    };
  });

const screens = [...outerScreens, ...innerScreens];

console.log(JSON.stringify(screens, null, 2));

tal
  .process(fs.readFileSync('assets/Vox.template.xml').toString(), {
    uuid: nanoid.customAlphabet('1234567890', 13),
    screens,
  })
  .then((result) => {
    fs.writeFileSync('output/VoxAuto.xml', result);
  });
