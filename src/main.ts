import { FsSourceLayout } from './fs/fs-source-layout.js';
import { FsTargetLayout } from './fs/fs-target-layout.js';
import { FsTemplateEngine } from './fs/fs-template-engine.js';
import { EjsTemplateEngine } from './render/ejs-template-engine.js';
import { MarkedMdRenderer } from './render/marked-md-renderer.js';
import { ShikiCodeHighlighter } from './render/shiki-code-highlighter.js';
import { SiteBuilder } from './tools/site-builder.js';

const sourceLayout = new FsSourceLayout();
const targetLayout = new FsTargetLayout();
const codeHighlighter = new ShikiCodeHighlighter();
const mdRenderer = new MarkedMdRenderer({ codeHighlighter });
const templateEngine = new FsTemplateEngine({
  sourceLayout,
  templateEngine: new EjsTemplateEngine(),
});
const siteBuilder = new SiteBuilder({ sourceLayout, targetLayout, mdRenderer, templateEngine });

siteBuilder.mdToHtml('index.html', {
  title: 'UCNot',
  mdPath: 'index.md',
  template: 'base.htm',
});

await siteBuilder.buildSite();
