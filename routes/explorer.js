const { Router } = require('express');
const handler = require('serve-handler');
const { join, extname, basename, dirname, parse } = require('path');
const fs = require('fs');
const { readdir } = require('../utils');

const router = Router();

const ROOT = '/archive';

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
    const files = await readdir(path, ROOT);
    files.forEach(f => {
      const ext = extname(f.path);
      if(!f.isdir && ext && ext !== '.mp4') {
        f.path = f.path + '?raw';
      }
    })
    res.render('explorer', { path, files });
  } catch (err) {
    res.status(404);
    res.end('Not Found');
  }
}

function renderVideo(req, res, next, path) {
  const title = basename(path);
  const videoUrl = path + '?raw';
  const subtitleUrl = parseSubtitle(path) + '?raw';
  
  res.render('video', { title, videoUrl, subtitleUrl });
}

function parseSubtitle(videoPath) {
  const dirPath = dirname(videoPath);
  const files = fs.readdirSync(join(ROOT, dirPath));
  
  for(const file of files) {
    const { name, ext } = parse(file);
    
    if (name === parse(videoPath).name && (ext === '.smi' || ext === '.srt' || ext === '.vtt')) {
      return join(dirPath, `${name}.vtt`);
    }
  }
  
  for(const file of files) {
    const { name, ext } = parse(file);
    
    if (name === 'ko' && (ext === '.smi' || ext === '.srt' || ext === '.vtt')) {
      return join(dirPath, `${name}.vtt`);
    }
  }
  
  for(const file of files) {
    const { name, ext } = parse(file);
    
    if (ext === '.smi' || ext === '.srt' || ext === '.vtt') {
      return join(dirPath, `${name}.vtt`);
    }
  }
  
  return undefined;
}

module.exports = router;