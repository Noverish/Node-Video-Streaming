import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';

import { COOKIE_KEY, USER_DB_FILE_PATH, USER_FIELD } from '@src/config';
import { verifyToken } from '@src/utils';
import { User } from '@src/models';

const users: User[] = JSON.parse(readFileSync(USER_DB_FILE_PATH).toString());

export default function (req: Request, res: Response, next: NextFunction) {
  const token: string = req.cookies[COOKIE_KEY] || req.query[COOKIE_KEY];
  const isLoginPath = req.path === '/login';

  verifyToken(token)
    .then((name: string) => {
      const user: User | undefined = users.find((v) => v.name === name);
      if (user) {
        req[USER_FIELD] = user;
        if (isLoginPath) {
          res.redirect('/');
        } else {
          next();
        }
      } else {
        verifyFailure(res, next, isLoginPath);
      }
    })
    .catch(() => verifyFailure(res, next, isLoginPath));
}

function verifyFailure(res: Response, next: NextFunction, isLoginPath: boolean) {
  if (isLoginPath) {
    next();
  } else {
    res.status(401);
    res.clearCookie(COOKIE_KEY);
    res.redirect('/login');
  }
}
