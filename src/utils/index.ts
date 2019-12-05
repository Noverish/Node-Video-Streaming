export * from './crypto';
export * from './fs';
export * from './subtitle-of-video';
export { default as vtt } from './vtt';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
