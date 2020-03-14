import {
  join, extname, dirname, parse,
} from 'path';
import { promises as fsPromises } from 'fs';

import { ROOT_PATH } from '@src/config';
import { Subtitle } from '@src/models';

const subtitleExtList = ['.smi', '.srt', '.vtt'];

export default async function (path: string): Promise<Subtitle[]> {
  if (extname(path) !== '.mp4') {
    throw new Error(`'${path}' is not mp4`);
  }

  const videoDirPath = dirname(path);
  const videoName = parse(path).name;
  return (await fsPromises.readdir(join(ROOT_PATH, videoDirPath)))
    .filter((f) => f.startsWith(videoName))
    .filter((f) => subtitleExtList.includes(extname(f)))
    .map((f): Subtitle => {
      const fileName = parse(f).name;
      const language = fileName.replace(videoName, '').replace(/\./g, '');

      return {
        url: `${join(videoDirPath, `${fileName}.vtt`)}?raw`,
        language: (language === '') ? 'default' : language,
      };
    })
    .sort((a, b) => {
      if (a.language === 'default') return -1;
      if (b.language === 'default') return 1;
      return 0;
    });
}
