import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { FsTargetDir } from './fs-target-dir.js';
import { TargetDir } from './target-dir.js';
import { TargetLayout } from './target-layout.js';

export class FsTargetLayout implements TargetLayout {

  readonly #rootDir: TargetDir;
  #siteDir?: TargetDir | undefined;

  constructor({
    root = resolve(cwd(), 'target'),
  }: {
    readonly root?: string | undefined;
  } = {}) {
    this.#rootDir = new FsTargetDir(this, root, '/');
  }

  rootDir(): TargetDir {
    return this.#rootDir;
  }

  siteDir(): TargetDir {
    return (this.#siteDir ??= new FsTargetDir(this, resolve(this.rootDir().path, 'site'), '/'));
  }

}
