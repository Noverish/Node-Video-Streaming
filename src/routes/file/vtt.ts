import { Request, Response, NextFunction } from 'express';
import { parse, join } from 'path';
import { promises as fsPromsies, existsSync } from 'fs';
import * as detectEncoding from 'detect-character-encoding';
import * as iconv from 'iconv-lite';

import { ROOT_PATH } from '@src/config';
import { smi2vtt, srt2vtt } from '@src/utils';

export default async function (req: Request, res: Response, next: NextFunction) {
  const parsed = parse(decodeURI(req.path));
  const smiPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.smi`);
  const srtPath = join(ROOT_PATH, parsed.dir, `${parsed.name}.srt`);

  if (existsSync(smiPath)) {
    const decoded = await decode(smiPath);
    res.set('Content-Type', 'text/vtt; charset=utf-8');
    res.status(200);
    res.end(smi2vtt(decoded));
  } else if (existsSync(srtPath)) {
    const decoded = await decode(srtPath);
    res.set('Content-Type', 'text/vtt; charset=utf-8');
    res.status(200);
    res.end(srt2vtt(decoded));
  } else {
    res.status(404);
    res.end('Not Found');
  }
}

async function decode(path: string): Promise<string> {
  const buffer = await fsPromsies.readFile(path);
  const { encoding } = detectEncoding(buffer);
  return iconv.decode(buffer, encoding);
}
