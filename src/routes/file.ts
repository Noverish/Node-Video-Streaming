import { Request, Response, NextFunction } from 'express';
import * as handler from 'serve-handler';
import { extname } from 'path';

import { ROOT_PATH } from '@src/config';
import { vtt } from '@src/utils';

export default function (req: Request, res: Response, next: NextFunction) {
  if (!Object.prototype.hasOwnProperty.call(req.query, 'raw')) {
    next();
    return;
  }

  const ext = extname(req.path);
  if (ext === '.vtt') {
    vtt(decodeURI(req.path), req, res, next);
    return;
  }

  handler(req, res, {
    public: ROOT_PATH,
    directoryListing: false,
    headers: [
      {
        source: '**/*.@(smi|srt)',
        headers: [{
          key: 'Content-Type',
          value: 'text/plain',
        }],
      },
    ],
  });
}
