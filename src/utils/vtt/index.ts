import { parse, join } from 'path';
import * as fs from 'fs';

import { ROOT_PATH } from '@src/config';
import smi2vtt from './smi2vtt';
import srt2vtt from './srt2vtt';

export default function (path: string): string {
  const parsed = parse(path);
  const smiPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.smi`);
  const srtPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.srt`);

  if (fs.existsSync(smiPath)) {
    return smi2vtt(smiPath);
  }  if (fs.existsSync(srtPath)) {
    return srt2vtt(srtPath);
  }
  return 'No Such Subtitle File';

}
