import { Router } from 'express';

import { verifyToken } from '@src/middlewares';
import explorer from './explorer';
import login from './login';
import file from './file';

const router = Router();

router.use(verifyToken);

router.use('/login', login);
router.use((req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.query, 'raw')) {
    file(req, res, next);
  } else {
    explorer(req, res, next);
  }
});

export default router;
