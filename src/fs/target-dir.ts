import { TargetFile } from './target-file.js';

export interface TargetDir {
  readonly path: string;
  readonly link: string;

  createDir(): Promise<void>;
  openSubDir(path: string): TargetDir;
  openFile(path: string): TargetFile;
}
