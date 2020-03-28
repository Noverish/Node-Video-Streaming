import * as parser from 'sami-parser';

import { SMICue } from '@src/models';

export default function (text: string) {
  const cues: SMICue[] = parser.parse(text).result;

  const results: {[lan: string]: string} = {};

  cues.forEach((cue: SMICue) => {
    const { startTime, endTime, languages } = cue;
    const time = `${convertTimeFormat(startTime)} --> ${convertTimeFormat(endTime)}`;

    Object.entries(languages)
      .forEach(([lan, sentence]) => {
        if (!results[lan]) {
          results[lan] = 'WEBVTT\n\n';
        }

        results[lan] += `${time}\n${sentence}\n\n`;
      });
  });

  if (results.ko) {
    return results.ko;
  } if (results.kr) {
    return results.kr;
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
