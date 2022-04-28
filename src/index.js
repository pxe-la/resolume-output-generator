const fs = require('fs');
const tal = require('template-tal');
const nanoid = require('nanoid');
const { getRects } = require('./calcPoints');

const ipToNumber = (ip) =>
  ip.split('.').reduceRight((acc, num, i) => acc + (num << (8 * i)), 0);

const rectsInner = getRects({ radius: 370, segCount: 24, segStartRadius: 25 });
const rectsOuter = getRects({
  radius: 370,
  segCount: 48,
  segStartRadius: 25 + 150 + 45,
});
const rects = [...rectsInner, ...rectsOuter];

const screens = rects.map(({ rect, theta }, i) => ({
  i,
  angle: theta,
  name: `LED ${i + 1}`,
  ip: `TT_IP\n${ipToNumber(`192.168.1.${i + 10}`)}`,
  rect,
}));

tal
  .process(fs.readFileSync('assets/Vox.xml.template').toString(), {
    uuid: nanoid.customAlphabet('1234567890', 13),
    screens,
  })
  .then((result) => {
    fs.writeFileSync('output/VoxAuto.xml', result);
  });
