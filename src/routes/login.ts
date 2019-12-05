import { Router } from 'express';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { sleep, encrypt } from '@src/utils';
import { COOKIE_KEY, USER_FILE } from '@src/config';

const router = Router();

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  (async function () {
    await sleep(1000);

    const tmpBuffer = await fsPromises.readFile(join(__dirname, '..', USER_FILE));
    const accessKeys = JSON.parse(tmpBuffer.toString());

    const accessKey = req.body['accessKey'];
    if (accessKeys.hasOwnProperty(accessKey)) {
      const encrypted = encrypt(accessKey);

      res.cookie(COOKIE_KEY, encrypted);
      res.redirect('/');
    } else {
      res.status(401);
      res.end('Wrong Access Key');
    }

  })().catch(next);
});

export default router;
