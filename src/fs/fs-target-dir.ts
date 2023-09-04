import { mkdir } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { FsTargetFile } from './fs-target-file.js';
import { FsTargetLayout } from './fs-target-layout.js';
import { TargetDir } from './target-dir.js';
import { TargetFile } from './target-file.js';

export class FsTargetDir implements TargetDir {

  readonly #layout: FsTargetLayout;
  readonly #path: string;
  readonly #link: string;
  #exists = false;

  constructor(layout: FsTargetLayout, path: string, link?: string) {
    this.#layout = layout;
    this.#path = path;

    if (link != null) {
      this.#link = link;
    } else {
      const rootPath = resolve(layout.rootDir().path);
      const fullPath = resolve(rootPath, path);
      const relPath = relative(rootPath, fullPath);

      this.#link = relPath.replaceAll('\\', '/') + '/';
    }
  }

  get path(): string {
    return this.#path;
  }

  get link(): string {
    return this.#link;
  }

  async createDir(): Promise<void> {
    if (!this.#exists) {
      await mkdir(this.path, { recursive: true });
      this.#exists = true;
    }
  }

  openSubDir(path: string): TargetDir {
    return new FsTargetDir(this.#layout, resolve(this.path, path));
  }

  openFile(path: string): TargetFile {
    return new FsTargetFile(this, resolve(this.path, path));
  }

}
