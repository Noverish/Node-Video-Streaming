import { Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import { extname, join } from 'path';

import { ROOT_PATH } from '@src/config';
import vtt from './vtt';
import file from './file';

export default async function (req: Request, res: Response, next: NextFunction) {
  const realPath = join(ROOT_PATH, decodeURI(req.path));
  const ext = extname(realPath);

  if (ext === '.vtt' && !existsSync(realPath)) {
    vtt(req, res, next);
  } else {
    file(req, res, next);
  }
}
