import { join, relative } from 'path';
import { promises as fsPromises } from 'fs';
import * as prettyBytes from 'pretty-bytes';

import { Stat } from '@src/models';
import { ROOT_PATH } from '@src/config';

export async function readdir(path: string): Promise<Stat[]> {
  const realPath = join(ROOT_PATH, path);

  try {
    await fsPromises.access(realPath);
  } catch (err) {
    throw new Error('존재하지 않는 경로 입니다');
  }

  const stat = await fsPromises.stat(realPath);
  if (stat.isFile()) {
    throw new Error('해당 경로는 폴더가 아니라 파일 입니다');
  }

  const files = await fsPromises.readdir(realPath, { withFileTypes: true });
  const results: Stat[] = [];

  for (const f of files) {
    const isdir = f.isDirectory();
    const filePath = join(path, f.name);
    const realFilePath = join(realPath, f.name);

    if (isdir) {
      const file = {
        isdir,
        path: filePath,
        name: f.name,
        size: '',
      };

      results.push(file);
    } else if (f.isFile()) {
      const stat = await fsPromises.stat(realFilePath);

      results.push({
        isdir,
        path: filePath,
        name: f.name,
        size: prettyBytes(stat.size),
      });
    }
  }

  return results;
}
