import { FsSourceLayout } from './fs/fs-source-layout.js';
import { FsTargetLayout } from './fs/fs-target-layout.js';
import { MarkedMdRenderer } from './render/marked-md-renderer.js';
import { ShikiCodeHighlighter } from './render/shiki-code-highlighter.js';
import { SiteBuilder } from './tools/site-builder.js';

const sourceLayout = new FsSourceLayout();
const targetLayout = new FsTargetLayout();
const codeHighlighter = new ShikiCodeHighlighter();
const mdRenderer = new MarkedMdRenderer({ codeHighlighter });
const siteBuilder = new SiteBuilder({ sourceLayout, targetLayout, mdRenderer });

siteBuilder.mdPage('index.html', {
  mdPath: 'index.md',
});

await siteBuilder.buildSite();
