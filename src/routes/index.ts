import { Router } from 'express';

import explorer from './explorer';
import login from './login';
import file from './file';

const router = Router();

router.use(file);
router.use('/login', login);
router.use('/', explorer);

export default router;
