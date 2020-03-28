import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';

import { COOKIE_KEY, USER_DB_FILE_PATH, USER_FIELD } from '@src/config';
import { decrypt } from '@src/utils';

const accessKeys = JSON.parse(readFileSync(USER_DB_FILE_PATH).toString());

export default function (req: Request, res: Response, next: NextFunction) {
  const isLoginPath = req.path === '/login';

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
