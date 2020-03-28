import { Request, Response, NextFunction } from 'express';
import {
  basename, join, dirname, extname,
} from 'path';
import { promises as fsPromises } from 'fs';

import { Subtitle } from '@src/models';
import { ROOT_PATH } from '@src/config';

export default async function (req: Request, res: Response, next: NextFunction) {
  const path = decodeURI(req.path);
  const title = basename(path);
  const videoPath = `${path}?raw`;
  const subtitles: Subtitle[] = await getSubtitlesOfVideo(path);

  res.render('video', { title, videoPath, subtitles });
}

const subtitleExtList = ['.smi', '.srt', '.vtt'];

async function getSubtitlesOfVideo(path: string): Promise<Subtitle[]> {
  const realPath = join(ROOT_PATH, path);
  const videoDirPath = dirname(path);
  const realVideoDirPath = dirname(realPath);
  const videoName = basename(path, extname(path));

  return (await fsPromises.readdir(realVideoDirPath))
    .filter((f) => f.startsWith(videoName))
    .filter((f) => subtitleExtList.includes(extname(f)))
    .map((f): Subtitle => {
      const fileName = basename(f, extname(f));
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
