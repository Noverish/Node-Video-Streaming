import { Router } from 'express';

import { verifyToken } from '@src/middlewares';
import explorer from './explorer';
import login from './login';
import file from './file';

const router = Router();

router.use('/login', login);

router.use(verifyToken);
router.use(file);
router.use('/', explorer);

export default router;
