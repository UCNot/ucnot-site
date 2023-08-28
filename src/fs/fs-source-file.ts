import { readFile } from 'node:fs/promises';
import { SourceFile } from './source-file.js';

export class FsSourceFile implements SourceFile {

  #path: string;

  constructor(path: string) {
    this.#path = path;
  }

  get path(): string {
    return this.#path;
  }

  async readText(): Promise<string> {
    return await readFile(this.#path, { encoding: 'utf-8' });
  }

}
