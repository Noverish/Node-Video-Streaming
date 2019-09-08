const express = require('express');
const morgan = require('morgan')
const { join } = require('path');

const logger = require('./middlewares/logger');
const decodePath = require('./middlewares/path');
const routes = require('./routes');

const app = express();
const port = parseInt(process.env.PORT) || 80;

app.set('port', port);
app.set('views', join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(decodePath);
app.use(logger);
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(join(__dirname, './public')));
app.use('/', routes);

app.use((req, res, next) => {
  res.end('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.end(err.toString());
});

app.listen(port, () => {
  console.log(`* HTML Server Started at ${port}`);
});
