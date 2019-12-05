import * as parser from 'sami-parser';
import * as iconv from 'iconv-lite';
import * as fs from 'fs';
import * as detectEncoding from 'detect-character-encoding';

export default function (path: string) {
  const fileBuffer = fs.readFileSync(path);
  const encoding = detectEncoding(fileBuffer).encoding;
  const content = iconv.decode(fileBuffer, encoding);
  const parsed = parser.parse(content);

  const results = {};

  for (const sentence of parsed['result']) {
    const startTime = sentence['startTime'];
    const endTime = sentence['endTime'];
    const content = sentence['languages'];

    if (!content) {
      continue;
    }

    const time = `${convertTimeFormat(startTime)} --> ${convertTimeFormat(endTime)}`;

    for (const language of Object.keys(content)) {
      if (!results[language]) {
        results[language] = 'WEBVTT\n\n';
      }

      results[language] += `${time}\n${content[language]}\n\n`;
    }
  }

  if (results.hasOwnProperty('ko')) {
    return results['ko'];
  }  if (results.hasOwnProperty('kr')) {
    return results['kr'];
  }
  return results[Object.keys(results)[0]];

}

function convertTimeFormat(millis) {
  const ms = millis % 1000;
  const s = Math.floor(millis / 1000) % 60;
  const m = Math.floor(millis / 1000 / 60) % 60;
  const h = Math.floor(millis / 1000 / 60 / 60);

  const padms = (`000${ms}`).slice(-3);
  const pads = (`00${s}`).slice(-2);
  const padm = (`00${m}`).slice(-2);
  const padh = (`00${h}`).slice(-2);

  return `${padh}:${padm}:${pads}.${padms}`;
}
