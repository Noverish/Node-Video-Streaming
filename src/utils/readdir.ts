import { join } from 'path';
import { promises as fsPromises, Dirent } from 'fs';
import * as prettyBytes from 'pretty-bytes';

import { Stat } from '@src/models';
import { ROOT_PATH } from '@src/config';

export default async function (path: string): Promise<Stat[]> {
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
        return {
          isdir,
          size,
          path: filePath,
          name: f.name,
        };
      }
      return undefined;
    })
    .filter((f) => f !== undefined);

  return Promise.all(promises);
}
