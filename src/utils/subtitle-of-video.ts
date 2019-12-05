import { join, extname, dirname, parse } from 'path';
import { promises as fsPromises } from 'fs';

import { ROOT_PATH } from '@src/config';

const subtitleExtList = ['.smi', '.srt', '.vtt'];

export async function getSubtitleOfVideoPath(path: string): Promise<string | null> {
  if (extname(path) !== '.mp4') {
    throw new Error(`'${path}' is not mp4`);
  }

  const videoDirPath = dirname(path);
  const videoName = parse(path).name;
  const files = await fsPromises.readdir(join(ROOT_PATH, videoDirPath));

  for (const file of files) {
    const { name, ext } = parse(file);

    if (name === videoName && subtitleExtList.includes(ext)) {
      return join(videoDirPath, `${name}.vtt`);
    }
  }

  // There is no subtitle file which name is same as video name
  for (const file of files) {
    const { name, ext } = parse(file);

    if (subtitleExtList.includes(ext)) {
      return join(videoDirPath, `${name}.vtt`);
    }
  }

  return null;
}
