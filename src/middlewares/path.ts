export default function (req, res, next) {
  req.originalUrl = decodeURI(req.originalUrl);
  req.baseUrl = decodeURI(req.baseUrl);
  // req.path = decodeURI(req.path);
  req.url = decodeURI(req.url);
  next();
}
