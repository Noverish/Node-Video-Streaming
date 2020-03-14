import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

import logger from '@src/middlewares/logger';
import decodePath from '@src/middlewares/path';
import auth from '@src/middlewares/auth';
import routes from '@src/routes';
import { PORT } from '@src/config';

const app = express();

app.set('port', PORT);
app.set('views', join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(decodePath);
app.use(logger);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(join(__dirname, '../public')));

app.use(auth);
app.use('/', routes);

app.use((req, res, next) => {
  res.end('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.end(err.stack);
});

app.listen(PORT, () => {
  console.log(`* HTML Server Started at ${PORT}`);
});
