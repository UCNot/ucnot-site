import { JSX } from 'typedoc';
import { TopBar } from './top-bar.component.js';
import { PageContext } from './page-context.js';
import { MdOutput } from './md-renderer.js';

export type PageTemplate = (props: PageProps) => JSX.Element;

export interface PageProps {
  readonly context: PageContext;
  readonly output: MdOutput;
}

export function DefaultPageTemplate(props: PageProps): JSX.Element {
  const { context, output } = props;
  const { html, attrs, toc } = output;
  const { title = 'UCNot' } = attrs;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          http-equiv="x-ua-compatible"
          content="ie=edge"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{title === 'UCNot' ? title : `${title} | UCNot`}</title>
        <link
          rel="stylesheet"
          href="css/app.css"
        />
      </head>
      <body>
        <TopBar context={context} />
        <div class="uc-container">
          <div class="uc-grid">
            <div class="uc-content">
              <JSX.Raw html={typeof html === 'string' ? html : JSX.renderElement(html)} />
            </div>
            <PageToc toc={toc} />
          </div>
        </div>
      </body>
    </html>
  );
}

function PageToc({ toc }: { readonly toc: MdOutput['toc'] }): JSX.Element {
  if (toc.length < 2) {
    return <></>;
  }

  return (
    <div class="uc-page-menu">
      <ul class="menu">
        {toc.map(({ link, text }) => (
          <li>
            <a href={link}>{text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
