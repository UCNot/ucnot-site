import { MenuItem } from '../render/menu.component.js';
import { SiteData, SitePage } from './site-page.js';

export class SiteSection {

  readonly #sectionId: string;
  #main: SitePage | undefined;
  #pages: SitePage[] = [];

  constructor(sectionId: string) {
    this.#sectionId = sectionId;
  }

  #getMain(): SitePage {
    if (!this.#main) {
      throw new Error(`Section ${this.#sectionId} has no main page`);
    }

    return this.#main;
  }

  addPage(page: SitePage): void {
    if (this.#main) {
      this.#main.addPage(page);
    } else if (page.attrs.main || !page.attrs.section) {
      this.#main = page;
      this.#pages.forEach(subPage => page.addPage(subPage));
      this.#pages.length = 0;
    } else {
      this.#pages.push(page);
    }
  }

  async renderSection(data: SiteData): Promise<void> {
    await this.#getMain().renderAll(data);
  }

  toMenuItem(): MenuItem {
    return this.#getMain().toMenuItem();
  }

}
