import {
  Router, Request, Response, NextFunction,
} from 'express';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { sleep, encrypt } from '@src/utils';
import { COOKIE_KEY, USER_FILE, COOKIE_EXPIRE_MILLIS } from '@src/config';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('login');
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  await sleep(1000);

  const tmpBuffer = await fsPromises.readFile(join(__dirname, '..', USER_FILE));
  const accessKeys = JSON.parse(tmpBuffer.toString());

  const { accessKey } = req.body;
  if (Object.prototype.hasOwnProperty.call(accessKeys, accessKey)) {
    const encrypted = encrypt(accessKey);

    res.cookie(COOKIE_KEY, encrypted, { expires: new Date(Date.now() + COOKIE_EXPIRE_MILLIS) });
    res.redirect('/');
  } else {
    res.status(401);
    res.end('Wrong Access Key');
  }
});

export default router;
