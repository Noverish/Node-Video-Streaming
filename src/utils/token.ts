import * as jwt from 'jsonwebtoken';

import { TOKEN_SECRET } from '@src/config';

interface TokenPayload {
  name: string;
}

export function verifyToken(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (err, payload: TokenPayload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload.name);
      }
    });
  });
}

export function issueToken(name: string, expiresIn: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const payload: TokenPayload = { name };
    jwt.sign(payload, TOKEN_SECRET, { expiresIn }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}
