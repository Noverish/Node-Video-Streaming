const { Router } = require('express');
const encryptor = require('simple-encryptor')('rlagustjq1q2w3e4r!@#$');

function encrypt(text) {
  return encryptor.encrypt(text);
}

function decrypt(cipher) {
  return encryptor.decrypt(cipher);
}

const accessKeys = {
  42843062019: '근무지원중대 306호',
  960909980727: 'Administrator - 김현섭',
};

const router = Router();

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res, next) => {
  setTimeout(() => {
    const accessKey = req.body.accessKey;

    if (accessKeys.hasOwnProperty(accessKey)) {
      const user = accessKeys[accessKey];
      const encrypted = encrypt(accessKey);

      res.render('login-process', { user, key: encrypted });
    } else {
      next({ status: 401, msg: '잘못된 접속 키 입니다.' });
    }
  }, 1000);
});

module.exports = router;
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;