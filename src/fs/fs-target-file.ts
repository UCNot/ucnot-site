import { writeFile } from 'node:fs/promises';
import { TargetDir } from './target-dir.js';
import { TargetFile } from './target-file.js';

export class FsTargetFile implements TargetFile {

  readonly #path: string;
  readonly #dir: TargetDir;

  constructor(dir: TargetDir, path: string) {
    this.#dir = dir;
    this.#path = path;
  }

  get path(): string {
    return this.#path;
  }

  async writeText(text: string): Promise<void> {
    await this.#dir.createDir();
    await writeFile(this.path, text);
  }

}
