import { MenuItem } from '../render/menu.component.js';

export abstract class SitePage {

  readonly #pages: SitePage[] = [];

  abstract readonly link: string;
  abstract readonly attrs: SitePageAttrs;

  get title(): string {
    return this.attrs.title ?? this.link;
  }

  get section(): string | undefined {
    return this.attrs.section;
  }

  get order(): number {
    return Number(this.attrs.order ?? Infinity);
  }

  addPage(page: SitePage): void {
    this.#pages.push(page);
  }

  abstract renderPage(data: SiteData): Promise<void>;

  async renderAll(data: SiteData): Promise<void> {
    await Promise.all([
      this.renderPage(data),
      ...this.#pages.map(async page => await page.renderAll(data)),
    ]);
  }

  compareTo(other: SitePage): number {
    if (this.order < other.order) {
      return -1;
    }
    if (this.order > other.order) {
      return 1;
    }
    if (this.title < other.title) {
      return -1;
    }
    if (this.title > other.title) {
      return 1;
    }

    return 0;
  }

  toMenuItem(): MenuItem {
    const pages = this.#pages.sort((p1, p2) => p1.compareTo(p2));

    return {
      link: this.link,
      text: this.title,
      nested: pages.map(page => ({
        link: page.link,
        text: page.title,
      })),
    };
  }

}

export interface SitePageAttrs {
  readonly title?: string | undefined;
  readonly section?: string | undefined;
  readonly main?: boolean | undefined;
  readonly order?: number | string | undefined;
  readonly [key: string]: unknown;
}

export interface SiteData {
  readonly navLinks: readonly MenuItem[];
}
