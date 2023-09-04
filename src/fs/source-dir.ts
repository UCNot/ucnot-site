import { SourceFile } from './source-file.js';

export interface SourceDir {
  readonly path: string;

  relativePath(file: SourceFile): string;
  readSources(): AsyncIterable<SourceFile>;
  openSubDir(path: string): SourceDir;
  openFile(path: string): SourceFile;
}
