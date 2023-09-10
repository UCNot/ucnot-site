import { PromiseResolver } from '@proc7ts/async';
import { SourceFile } from '../fs/source-file.js';
import { SourceLayout } from '../fs/source-layout.js';
import { TargetFile } from '../fs/target-file.js';
import { TargetLayout } from '../fs/target-layout.js';
import { MdAttrs, MdOutput, MdRenderer } from '../render/md-renderer.js';
import { DefaultPageTemplate, PageTemplate } from '../render/page.template.js';
import { MdSitePage } from './md.site-page.js';
import { SiteData, SitePage, SitePageAttrs } from './site-page.js';
import { SiteSection } from './site-section.js';

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
    mdFile: SourceFile | string,
    {
      htmlFile,
      template = DefaultPageTemplate,
      attrs,
    }: {
      readonly htmlFile?: TargetFile | string | undefined;
      readonly template?: PageTemplate | undefined;
      readonly attrs?: SitePageAttrs | undefined;
    } = {},
  ): () => Promise<void> {
    return this.runTask(async () => {
      const sourceFile =
        typeof mdFile === 'string' ? this.#sourceLayout.contentDir().openFile(mdFile) : mdFile;
      const targetFile =
        htmlFile == null
          ? this.#htmlFile(sourceFile)
          : typeof htmlFile === 'string'
          ? this.#targetLayout.siteDir().openFile(htmlFile)
          : htmlFile;
      const output = await this.#renderMd(sourceFile, attrs);

      this.#addPage(new MdSitePage(targetFile, template, output));
    });
  }

  #htmlFile(sourceFile: SourceFile): TargetFile {
    const ext = sourceFile.extname();

    return this.#targetLayout
      .siteDir()
      .openFile(
        this.#sourceLayout.contentDir().relativePath(sourceFile).slice(0, -ext.length) + '.html',
      );
  }

  async #renderMd(mdFile: SourceFile, attrs: MdAttrs | undefined): Promise<MdOutput> {
    const md = await mdFile.readText();

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

  addMdDir(
    dirPath: string,
    {
      template,
      attrs,
    }: {
      readonly template?: PageTemplate | undefined;
      readonly attrs?: SitePageAttrs | undefined;
    } = {},
  ): () => Promise<void> {
    return this.runTask(async () => {
      const results: (() => Promise<void>)[] = [];
      const sourceDir = this.#sourceLayout.contentDir().openSubDir(dirPath);

      for await (const mdFile of sourceDir.readSources()) {
        results.push(this.addMdPage(mdFile, { template, attrs }));
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
    for (const task of tasks) {
      await task.run(this);
    }

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
