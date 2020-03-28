import { Request, Response, NextFunction } from 'express';
import { join, extname } from 'path';
import { promises as fsPromises, Dirent } from 'fs';
import * as prettyBytes from 'pretty-bytes';

import { USER_FIELD, ROOT_PATH } from '@src/config';
import { User, Stat } from '@src/models';

export default async function (req: Request, res: Response, next: NextFunction) {
  const path = decodeURI(req.path);
  const files: Stat[] = await readdir(path);

  res.render('explorer', { path, files, username: (req[USER_FIELD] as User).name });
}

async function readdir(path: string): Promise<Stat[]> {
  const realPath = join(ROOT_PATH, path);

  const dirents: Dirent[] = await fsPromises.readdir(realPath, { withFileTypes: true });
  const promises: Promise<Stat>[] = dirents
    .map(async (f) => {
      const isdir = f.isDirectory();
      const isFile = f.isFile();
      const filePath = join(path, f.name);
      const realFilePath = join(realPath, f.name);
      const size = isFile ? prettyBytes((await fsPromises.stat(realFilePath)).size) : '';

      if (isdir || isFile) {
        const ext = extname(f.name);
        const isFileAndNotMP4 = isFile && ext !== '.mp4';
        const url = filePath + (isFileAndNotMP4 ? '?raw' : '');
        return { size, path: url, name: f.name };
      }
      return undefined;
    })
    .filter((f) => f !== undefined);

  return Promise.all(promises);
}
