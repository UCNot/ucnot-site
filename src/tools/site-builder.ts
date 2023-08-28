import { PromiseResolver } from '@proc7ts/async';
import { noop } from '@proc7ts/primitives';
import { SourceLayout } from '../fs/source-layout.js';
import { TargetLayout } from '../fs/target-layout.js';
import { HtmlTemplateData } from '../render/html-template.js';
import { MdRenderer } from '../render/md-renderer.js';
import { TemplateEngine } from '../render/template-engine.js';

export class SiteBuilder {

  readonly #sourceLayout: SourceLayout;
  readonly #targetLayout: TargetLayout;
  readonly #mdRenderer: MdRenderer;
  readonly #templateEngine: TemplateEngine;
  #build: SiteBuild = { tasks: [] };

  constructor({
    sourceLayout,
    targetLayout,
    mdRenderer,
    templateEngine,
  }: {
    readonly sourceLayout: SourceLayout;
    readonly targetLayout: TargetLayout;
    readonly mdRenderer: MdRenderer;
    readonly templateEngine: TemplateEngine;
  }) {
    this.#sourceLayout = sourceLayout;
    this.#targetLayout = targetLayout;
    this.#mdRenderer = mdRenderer;
    this.#templateEngine = templateEngine;
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

  mdToHtml<TData extends HtmlTemplateData>(
    htmlPath: string,
    {
      title,
      mdPath,
      template,
      data,
    }: {
      readonly title: string;
      readonly mdPath: string;
      readonly template: string;
      readonly data?: TData | undefined;
    },
  ): () => Promise<void> {
    return this.runTask(async () => {
      const pageTemplate = this.#templateEngine.openPageTemplate(template);
      const md = await this.#sourceLayout.contentDir().openFile(mdPath).readText();
      const content = await this.#mdRenderer.renderMarkdown(md);
      const html = await pageTemplate.renderHtml({ ...data, title, content });

      await this.#targetLayout.siteDir().openFile(htmlPath).writeText(html);
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
