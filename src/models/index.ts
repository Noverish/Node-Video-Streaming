export interface Stat {
  path: string;
  name: string;
  size: string;
  isdir: boolean;
}

export interface Subtitle {
  url: string;
  language: string;
}

export interface SMICue {
  startTime: number;
  endTime: number;
  languages: {[lan: string]: string};
}

export interface User {
  encryptedAccessKey: string;
  accessKey: string;
  username: string;
}
