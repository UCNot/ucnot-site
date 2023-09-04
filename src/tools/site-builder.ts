import { PromiseResolver } from '@proc7ts/async';
import { noop } from '@proc7ts/primitives';
import { SourceFile } from '../fs/source-file.js';
import { SourceLayout } from '../fs/source-layout.js';
import { TargetFile } from '../fs/target-file.js';
import { TargetLayout } from '../fs/target-layout.js';
import { MdAttrs, MdOutput, MdRenderer } from '../render/md-renderer.js';
import { MenuItem } from '../render/menu.component.js';
import { DefaultPageTemplate, PageTemplate } from '../render/page.template.js';
import { MdSitePage } from './md.site-page.js';
import { SiteData, SitePage } from './site-page.js';

export class SiteBuilder {

  readonly #sourceLayout: SourceLayout;
  readonly #targetLayout: TargetLayout;
  readonly #mdRenderer: MdRenderer;
  readonly #sections = new Map<string, SiteSection>();
  #build: SiteBuild = { tasks: [] };

  constructor({
    sourceLayout,
    targetLayout,
    mdRenderer,
  }: {
    readonly sourceLayout: SourceLayout;
    readonly targetLayout: TargetLayout;
    readonly mdRenderer: MdRenderer;
  }) {
    this.#sourceLayout = sourceLayout;
    this.#targetLayout = targetLayout;
    this.#mdRenderer = mdRenderer;
  }

  runTask<T>(task: (builder: SiteBuilder) => Promise<T>): () => Promise<T> {
    const builderTask = new SiteBuildTask<T>(task);
    const { tasks } = this.#build;

    if (tasks) {
      tasks.push(builderTask);

      return async () => await builderTask.run(this);
    }

    const { resolve, whenDone } = new PromiseResolver<T>();

    resolve(builderTask.run(this));

    return whenDone;
  }

  addMdPage(
    htmlFile: TargetFile | string,
    {
      mdFile,
      template = DefaultPageTemplate,
      attrs,
    }: {
      readonly mdFile: SourceFile | string;
      readonly template?: PageTemplate | undefined;
      readonly attrs?: MdAttrs | undefined;
    },
  ): () => Promise<void> {
    return this.runTask(async () => {
      const output = await this.#renderMd(mdFile, attrs);

      this.#addPage(
        new MdSitePage(
          typeof htmlFile === 'string' ? this.#targetLayout.siteDir().openFile(htmlFile) : htmlFile,
          template,
          output,
        ),
      );
    });
  }

  async #renderMd(mdFile: SourceFile | string, attrs: MdAttrs | undefined): Promise<MdOutput> {
    const sourceFile =
      typeof mdFile === 'string' ? this.#sourceLayout.contentDir().openFile(mdFile) : mdFile;
    const md = await sourceFile.readText();

    return await this.#mdRenderer.renderMarkdown(md, attrs);
  }

  #addPage(page: SitePage): void {
    const { section, link } = page;

    this.#getSection(section ?? link).addPage(page);
  }

  #getSection(sectionId: string): SiteSection {
    let section = this.#sections.get(sectionId);

    if (!section) {
      section = new SiteSection(sectionId);
      this.#sections.set(sectionId, section);
    }

    return section;
  }

  addMdPages(
    dirPath: string,
    {
      template,
      attrs,
    }: {
      readonly template?: PageTemplate | undefined;
      readonly attrs?: MdAttrs | undefined;
    },
  ): () => Promise<void> {
    return this.runTask(async () => {
      const results: (() => Promise<void>)[] = [];
      const sourceDir = this.#sourceLayout.contentDir().openSubDir(dirPath);

      for await (const mdFile of sourceDir.readSources()) {
        const ext = mdFile.extname();
        const htmlFile =
          this.#sourceLayout.contentDir().relativePath(mdFile).slice(-ext.length) + '.html';

        results.push(this.addMdPage(htmlFile, { mdFile, template, attrs }));
      }

      await Promise.all(results.map(result => result()));
    });
  }

  async buildSite(): Promise<void> {
    const { tasks, whenDone } = this.#build;

    if (whenDone) {
      return whenDone;
    }

    const whenBuilt = this.#buildSite(tasks);

    this.#build = { whenDone: whenBuilt };

    return whenBuilt;
  }

  async #buildSite(tasks: readonly SiteBuildTask[]): Promise<void> {
    await Promise.all(tasks.map(async task => await task.run(this))).then(noop);

    const sections = [...this.#sections.values()];
    const siteData: SiteData = {
      navLinks: sections.map(section => section.toMenuItem()),
    };

    await Promise.all(sections.map(section => section.renderSection(siteData)));
  }

}

class SiteBuildTask<out T = unknown> {

  readonly task: (builder: SiteBuilder) => Promise<T>;
  #whenBuilt?: Promise<T>;

  constructor(task: (builder: SiteBuilder) => Promise<T>) {
    this.task = task;
  }

  run(builder: SiteBuilder): Promise<T> {
    return (this.#whenBuilt ??= this.task(builder));
  }

}

type SiteBuild = SiteBuild$Pending | SiteBuild$Running;

interface SiteBuild$Pending {
  readonly tasks: SiteBuildTask[];
  readonly whenDone?: undefined;
}

interface SiteBuild$Running {
  readonly tasks?: undefined;
  readonly whenDone: Promise<void>;
}

class SiteSection {

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
      page.addPage(page);
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
