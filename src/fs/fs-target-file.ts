import { writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import { TargetDir } from './target-dir.js';
import { TargetFile } from './target-file.js';

export class FsTargetFile implements TargetFile {

  readonly #dir: TargetDir;
  readonly #path: string;
  readonly #link: string;

  constructor(dir: TargetDir, path: string) {
    this.#dir = dir;
    this.#path = path;

    const fullPath = resolve(dir.path, path);
    const relPath = relative(dir.path, fullPath);

    this.#link = dir.link + relPath.replaceAll('\\', '/');
  }

  get path(): string {
    return this.#path;
  }

  get link(): string {
    return this.#link;
  }

  async writeText(text: string): Promise<void> {
    await this.#dir.createDir();
    await writeFile(this.path, text);
  }

}
