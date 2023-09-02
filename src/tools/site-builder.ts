import { PromiseResolver } from '@proc7ts/async';
import { noop } from '@proc7ts/primitives';
import { JSX } from 'typedoc';
import { SourceLayout } from '../fs/source-layout.js';
import { TargetLayout } from '../fs/target-layout.js';
import { MdAttrs, MdRenderer } from '../render/md-renderer.js';
import { PageContext } from '../render/page-context.js';
import { DefaultPageTemplate, PageTemplate } from '../render/page.template.js';

export class SiteBuilder {

  readonly #sourceLayout: SourceLayout;
  readonly #targetLayout: TargetLayout;
  readonly #mdRenderer: MdRenderer;
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
      const md = await this.#sourceLayout.contentDir().openFile(mdPath).readText();
      const output = await this.#mdRenderer.renderMarkdown(md, attrs);
      const context = new PageContext(htmlPath);
      const html = template({
        context,
        output,
      });

      await this.#targetLayout.siteDir().openFile(htmlPath).writeText(JSX.renderElement(html));
    });
  }

  async buildSite(): Promise<void> {
    const { tasks, whenDone } = this.#build;

    if (whenDone) {
      return whenDone;
    }

    const whenBuilt = Promise.all(tasks.map(async task => await task.run(this))).then(noop);

    this.#build = { whenDone: whenBuilt };

    return whenBuilt;
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
