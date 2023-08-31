import { relative } from 'node:path/posix';

export class PageContext {

  readonly #path: string;
  #dir?: string;

  constructor(path: string) {
    this.#path = path.startsWith('/') ? path : `/${path}`;
  }

  get path(): string {
    return this.#path;
  }

  get dir(): string {
    if (this.#dir != null) {
      return this.#dir;
    }

    const { path } = this;
    const lastSlash = path.lastIndexOf('/');

    return (this.#dir = lastSlash > 0 ? path.slice(0, lastSlash + 1) : '/');
  }

  relative(path: string): string {
    return relative(this.dir, path) || '.';
  }

}
