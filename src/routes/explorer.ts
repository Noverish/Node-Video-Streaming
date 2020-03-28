import {
  Router, Request, Response, NextFunction,
} from 'express';
import { join, extname, basename } from 'path';

import { readdir, getSubtitlesOfVideoPath } from '@src/utils';
import { USER_FIELD } from '@src/config';
import { Subtitle, User } from '@src/models';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  process(req, res, next)
    .catch((err) => {
      next(err);
    });
});

router.get('/:path*', (req: Request, res: Response, next: NextFunction) => {
  process(req, res, next)
    .catch((err) => {
      next(err);
    });
});

async function process(req: Request, res: Response, next: NextFunction) {
  const path = join(req.baseUrl, decodeURI(req.path));

  if (extname(path) === '.mp4') {
    renderVideo(req, res, next, path);
    return;
  }

  try {
    const files = (await readdir(path))
      .map((f) => {
        const ext = extname(f.path);
        const isFileAndNotMP4 = !f.isdir && ext && ext !== '.mp4';
        return {
          path: f.path + (isFileAndNotMP4 ? '?raw' : ''),
          size: f.size,
          name: f.name,
        };
      });

    res.render('explorer', { path, files, username: (req[USER_FIELD] as User).name });
  } catch (err) {
    res.status(404);
    res.end('Not Found');
  }
}

async function renderVideo(req: Request, res: Response, next: NextFunction, path: string) {
  const title = basename(path);
  const videoPath = `${path}?raw`;
  const subtitles: Subtitle[] = await getSubtitlesOfVideoPath(path);

  res.render('video', { title, videoPath, subtitles });
}

export default router;
