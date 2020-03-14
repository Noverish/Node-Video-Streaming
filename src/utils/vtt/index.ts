import { Request, Response, NextFunction } from 'express';
import { parse, join } from 'path';
import * as fs from 'fs';

import { ROOT_PATH } from '@src/config';
import smi2vtt from './smi2vtt';
import srt2vtt from './srt2vtt';

export default function (path: string, req: Request, res: Response, next: NextFunction) {
  const parsed = parse(path);
  const smiPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.smi`);
  const srtPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.srt`);

  if (fs.existsSync(smiPath)) {
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.statusCode = 200;
    res.end(smi2vtt(smiPath));
  } else if (fs.existsSync(srtPath)) {
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.statusCode = 200;
    res.end(srt2vtt(srtPath));
  }
}
