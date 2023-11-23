import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { SourceFile } from './source-file.js';

export class FsSourceFile implements SourceFile {

  readonly #path: string;

  constructor(path: string) {
    this.#path = path;
  }

  get path(): string {
    return this.#path;
  }

  extname(): string {
    return extname(this.path);
  }

  async readText(): Promise<string> {
    return await readFile(this.#path, { encoding: 'utf-8' });
  }

}
