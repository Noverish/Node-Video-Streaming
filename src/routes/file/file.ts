import { Request, Response, NextFunction } from 'express';
import * as handler from 'serve-handler';

import { ROOT_PATH } from '@src/config';

export default function (req: Request, res: Response, next: NextFunction) {
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
