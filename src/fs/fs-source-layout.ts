import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { FsSourceDir } from './fs-source-dir.js';
import { SourceDir } from './source-dir.js';
import { SourceLayout } from './source-layout.js';

export class FsSourceLayout implements SourceLayout {

  readonly #rootDir: SourceDir;
  #contentDir?: SourceDir;
  #templates?: SourceDir;

  constructor({
    root = resolve(cwd(), 'src'),
  }: {
    readonly root?: string | undefined;
  } = {}) {
    this.#rootDir = new FsSourceDir(root);
  }

  rootDir(): SourceDir {
    return this.#rootDir;
  }

  contentDir(): SourceDir {
    return (this.#contentDir ??= this.rootDir().openSubDir('content'));
  }

  templatesDir(): SourceDir {
    return (this.#templates ??= this.rootDir().openSubDir('templates'));
  }

}
