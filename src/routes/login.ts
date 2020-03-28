import {
  Router, Request, Response, NextFunction,
} from 'express';
import { readFileSync } from 'fs';

import { encrypt } from '@src/utils';
import { COOKIE_KEY, USER_DB_FILE_PATH, COOKIE_EXPIRE_MILLIS } from '@src/config';

const accessKeys = JSON.parse(readFileSync(USER_DB_FILE_PATH).toString());

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('login');
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  setTimeout(() => {
    const { accessKey } = req.body;
    if (Object.prototype.hasOwnProperty.call(accessKeys, accessKey)) {
      const encrypted = encrypt(accessKey);

      res.cookie(COOKIE_KEY, encrypted, { expires: new Date(Date.now() + COOKIE_EXPIRE_MILLIS) });
      res.redirect('/');
    } else {
      res.status(401);
      res.end('Wrong Access Key');
    }
  }, 1000);
});

export default router;
