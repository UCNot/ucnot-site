import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { FsTargetFile } from './fs-target-file.js';
import { TargetDir } from './target-dir.js';
import { TargetFile } from './target-file.js';

export class FsTargetDir implements TargetDir {

  readonly #path: string;
  #exists = false;

  constructor(path: string) {
    this.#path = path;
  }

  get path(): string {
    return this.#path;
  }

  async createDir(): Promise<void> {
    if (!this.#exists) {
      await mkdir(this.path, { recursive: true });
      this.#exists = true;
    }
  }

  openSubDir(path: string): TargetDir {
    return new FsTargetDir(resolve(this.path, path));
  }

  openFile(path: string): TargetFile {
    return new FsTargetFile(this, resolve(this.path, path));
  }

}
