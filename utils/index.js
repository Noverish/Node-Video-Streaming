const { join, relative } = require('path');
const fs = require('fs');
const prettyBytes = require('pretty-bytes');
const fsPromises = fs.promises;

async function readdir(virtualPath, root) {
  const path = join(root, virtualPath);
  
  try {
    await fsPromises.access(path, fs.constants.R_OK);
  } catch (err) {
    throw new Error('존재하지 않는 폴더 입니다');
  }

  const stat = await fsPromises.stat(path);
  if (stat.isFile()) {
    throw new Error('이건 폴더가 아니라 파일 입니다');
  }

  const files = await fsPromises.readdir(path, { withFileTypes: true });
  const results = [];

  for (const f of files) {
    const isdir = f.isDirectory();
    const filePath = join(path, f.name);
    

    if (isdir) {
      const file = {
        isdir,
        path: '/' + relative(root, filePath),
        name: f.name,
        size: null,
      };

      results.push(file);
    } else if (f.isFile()) {
      const stat = fs.statSync(filePath);

      results.push({
        isdir,
        path: '/' + relative(root, filePath),
        name: f.name,
        size: prettyBytes(stat.size),
      });
    }
  }

  return results;
}

module.exports.readdir = readdir;