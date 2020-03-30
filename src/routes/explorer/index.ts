import { Request, Response, NextFunction } from 'express';
import { join, extname } from 'path';
import { promises as fsPromises } from 'fs';

import { ROOT_PATH } from '@src/config';
import video from './video';
import explorer from './explorer';

export default async function (req: Request, res: Response, next: NextFunction) {
  const path = decodeURI(req.path);
  const realPath = join(ROOT_PATH, path);

  try {
    await fsPromises.access(realPath);
  } catch (err) {
    res.status(404);
    res.end('Not Found');
    return;
  }

  const stat = await fsPromises.stat(realPath);
  if (stat.isFile()) {
    if (extname(path) === '.mp4') {
      video(req, res, next);
    } else {
      res.status(400);
      res.end('Not Directory');
    }
  } else if (stat.isDirectory()) {
    explorer(req, res, next);
  } else {
    res.status(400);
    res.end('Not File and Not Directory');
  }
}
