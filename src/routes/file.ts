import { Request, Response, NextFunction } from 'express';
import * as handler from 'serve-handler';
import { extname } from 'path';

import { ROOT_PATH } from '@src/config';
import { vtt } from '@src/utils';

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.query.hasOwnProperty('raw')) {
    next();
    return;
  }

  const ext = extname(req.path);
  if (ext === '.vtt') {
    const converted = vtt(decodeURI(req.path));
    res.status(200);
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.end(converted);
    return;
  }

  return handler(req, res, {
    public: ROOT_PATH,
    directoryListing: false,
    headers: [
      {
        source : '**/*.@(smi|srt)',
        headers : [{
          key : 'Content-Type',
          value : 'text/plain',
        }],
      },
    ],
  });
}
