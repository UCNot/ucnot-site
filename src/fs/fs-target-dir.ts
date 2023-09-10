import { mkdir } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';
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
      const rootPath = resolve(layout.siteDir().path);
      const fullPath = resolve(rootPath, path);
      const relPath = relative(rootPath, fullPath);

      this.#link = '/' + relPath.replaceAll('\\', '/') + '/';
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
    const fullPath = resolve(this.path, path);
    const relPath = relative(this.path, fullPath);
    const pathParts = relPath.split(sep);
    const dir = pathParts.length < 2 ? this : this.openSubDir(join(...pathParts.slice(0, -1)));

    return new FsTargetFile(dir, fullPath);
  }

}
