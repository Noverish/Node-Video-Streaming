import {
  Router, Request, Response, NextFunction,
} from 'express';
import { readFileSync } from 'fs';

import { issueToken } from '@src/utils';
import { COOKIE_KEY, USER_DB_FILE_PATH } from '@src/config';
import { User } from '@src/models';

const users: User[] = JSON.parse(readFileSync(USER_DB_FILE_PATH).toString());

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('login');
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body as { password: string };

  const user: User | undefined = users.find((v) => v.password === password);
  if (user) {
    issueToken(user.name, user.expiresIn)
      .then((token) => {
        res.cookie(COOKIE_KEY, token);
        res.redirect('/');
      })
      .catch(next);
  } else {
    res.status(401);
    res.end('Wrong Password');
  }
});

export default router;
