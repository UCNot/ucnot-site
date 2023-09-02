import { PromiseResolver } from '@proc7ts/async';
import { noop } from '@proc7ts/primitives';
import { SourceLayout } from '../fs/source-layout.js';
import { TargetLayout } from '../fs/target-layout.js';
import { MdAttrs, MdOutput, MdRenderer } from '../render/md-renderer.js';
import { DefaultPageTemplate, PageTemplate } from '../render/page.template.js';
import { MdSitePage } from './md.site-page.js';
import { SitePage } from './site-page.js';

export class SiteBuilder {

  readonly #sourceLayout: SourceLayout;
  readonly #targetLayout: TargetLayout;
  readonly #mdRenderer: MdRenderer;
  readonly #pages: SitePage[] = [];
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

  mdPage(
    htmlPath: string,
    {
      mdPath,
      template = DefaultPageTemplate,
      attrs,
    }: {
      readonly mdPath: string;
      readonly template?: PageTemplate | undefined;
      readonly attrs?: MdAttrs | undefined;
    },
  ): () => Promise<void> {
    return this.runTask(async () => {
      const output = await this.#renderMd(mdPath, attrs);

      this.#addPage(new MdSitePage(htmlPath, template, output));
    });
  }

  async #renderMd(mdPath: string, attrs: MdAttrs | undefined): Promise<MdOutput> {
    const md = await this.#sourceLayout.contentDir().openFile(mdPath).readText();

    return await this.#mdRenderer.renderMarkdown(md, attrs);
  }

  #addPage(page: SitePage): void {
    this.#pages.push(page);
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
    await Promise.all(
      this.#pages.map(page => page.renderPage({
          targetLayout: this.#targetLayout,
          navLinks: this.#pages,
        })),
    );
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
