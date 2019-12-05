import { Router } from 'express';
import { join, extname, basename, dirname, parse } from 'path';

import { readdir, getSubtitleOfVideoPath } from '@src/utils';
import { COOKIE_KEY } from '@src/config';
import { Stat } from '@src/models';

const router = Router();

router.get('/', (req, res, next) => {
  process(req, res, next)
    .catch((err) => {
      next(err);
    });
});

router.get('/:path*', (req, res, next) => {
  process(req, res, next)
    .catch((err) => {
      next(err);
    });
});

async function process(req, res, next) {
  const path = join(req.baseUrl, decodeURI(req.path));

  if (extname(path) === '.mp4') {
    renderVideo(req, res, next, path);
    return;
  }

  try {
    const files: Stat[] = await readdir(path);
    files.forEach((f) => {
      const ext = extname(f.path);
      if (!f.isdir && ext && ext !== '.mp4') {
        f.path = f.path + '?raw';
      }
    });
    res.render('explorer', { path, files, username: req['username'] });
  } catch (err) {
    res.status(404);
    res.end('Not Found');
  }
}

async function renderVideo(req, res, next, path) {
  const title = basename(path);
  const videoPath = path + `?raw&${COOKIE_KEY}=${encodeURIComponent(req['encryptedAccessKey'])}`;
  const tmp: string | null = await getSubtitleOfVideoPath(path);
  const subtitlePath = (tmp) ? (tmp + '?raw') : undefined;

  res.render('video', { title, videoPath, subtitlePath });
}

export default router;
