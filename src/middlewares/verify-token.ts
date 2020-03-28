import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';

import { COOKIE_KEY, USER_DB_FILE_PATH, USER_FIELD } from '@src/config';
import { verifyToken } from '@src/utils';
import { User } from '@src/models';

const users: User[] = JSON.parse(readFileSync(USER_DB_FILE_PATH).toString());

export default function (req: Request, res: Response, next: NextFunction) {
  const token: string = req.cookies[COOKIE_KEY];

  if (!token) {
    res.redirect('/login');
    return;
  }

  verifyToken(token)
    .then((name: string) => {
      const user: User | undefined = users.find((v) => v.name === name);
      if (user) {
        req[USER_FIELD] = user;
        next();
      } else {
        res.status(401);
        res.clearCookie(COOKIE_KEY);
        res.json({ msg: 'Removed User' });
      }
    })
    .catch(() => {
      res.status(401);
      res.clearCookie(COOKIE_KEY);
      res.json({ msg: 'Invalid Token' });
    });
}
