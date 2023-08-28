import { SourceFile } from './source-file.js';

export interface SourceDir {
  readonly path: string;

  readSources(): AsyncIterable<SourceFile>;
  openSubDir(path: string): SourceDir;
  openFile(path: string): SourceFile;
}
