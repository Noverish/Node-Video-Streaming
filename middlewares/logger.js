const morgan = require('morgan');
const moment = require('moment-timezone');

morgan.token('remote-addr', (req, res) => {
  const ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
  if(ip && typeof ip === 'string' && ip.split(':').length === 4) {
    return ip.split(':')[3];
  } else {
    return ip;
  }
});

morgan.token('date', (req, res) => {
  return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
});

morgan.token('user_id', (req, res) => {
  return (req.headers['user_id']) ? req.headers['user_id'] : undefined;
});

const consoleFormat = '[:date] <:remote-addr> :user_id - :method :status :response-time ms ":url"';

module.exports = morgan(consoleFormat, {
  skip: (req, res) => {
    return req.originalUrl.endsWith('.js') || req.originalUrl.endsWith('.ico');
  }
});