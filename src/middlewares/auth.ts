import { Request, Response, NextFunction } from 'express';
import { promises as fsPromises } from 'fs';
import { join } from 'path';

import { COOKIE_KEY, USER_FILE, USER_FIELD } from '@src/config';
import { decrypt } from '@src/utils';

export default async function (req: Request, res: Response, next: NextFunction) {
  const isLoginPath = req.path === '/login';

  const tmpBuffer = await fsPromises.readFile(join(__dirname, '..', USER_FILE));
  const accessKeys = JSON.parse(tmpBuffer.toString());

  const encryptedAccessKey = req.query[COOKIE_KEY] || req.cookies[COOKIE_KEY];

  if (encryptedAccessKey) {
    try {
      const accessKey = decrypt(encryptedAccessKey);
      const username = accessKeys[accessKey];

      if (username) {
        req[USER_FIELD] = { encryptedAccessKey, accessKey, username };

        if (isLoginPath) {
          res.redirect('/');
        } else {
          next();
        }

        return;
      }
    } catch (err) {
      // do nothing
    }
  }

  if (encryptedAccessKey) {
    res.clearCookie(COOKIE_KEY);
  }

  if (!isLoginPath) {
    res.redirect('/login');
  } else {
    next();
  }
}
