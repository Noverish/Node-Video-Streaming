module.exports = function (req, res, next) {
  req.originalUrl = decodeURI(req.originalUrl);
  req.url = decodeURI(req.url);
  next();
}