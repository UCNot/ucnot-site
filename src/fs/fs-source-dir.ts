import { readdir } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { FsSourceFile } from './fs-source-file.js';
import { SourceDir } from './source-dir.js';
import { SourceFile } from './source-file.js';

export class FsSourceDir implements SourceDir {

  readonly #path: string;

  constructor(path: string) {
    this.#path = path;
  }

  get path(): string {
    return this.#path;
  }

  relativePath(file: SourceFile): string {
    return relative(this.path, file.path);
  }

  async *readSources(): AsyncIterable<SourceFile> {
    for (const dirEnt of await readdir(this.path, { withFileTypes: true })) {
      if (dirEnt.isFile()) {
        yield this.openFile(dirEnt.name);
      }
    }
  }

  openSubDir(path: string): SourceDir {
    return new FsSourceDir(resolve(this.path, path));
  }

  openFile(path: string): SourceFile {
    return new FsSourceFile(resolve(this.path, path));
  }

}
