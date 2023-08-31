import { JSX, RenderTemplate } from 'typedoc';
import { TopBar } from './top-bar.component.js';
import { PageContext } from './page-context.js';

export type PageLayout<T extends PageData> = (content: RenderTemplate<T>, data: T) => JSX.Element;

export interface PageData {
  readonly context: PageContext;
  readonly title: string;
  readonly [key: string]: unknown;
}

export function defaultPageLayout<T extends PageData>(
  content: RenderTemplate<T>,
  data: T,
): JSX.Element {
  const html = content(data);

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
        <title>{data.title}</title>
        <link
          rel="stylesheet"
          href="css/app.css"
        />
      </head>
      <body>
        <TopBar context={data.context} />
        <div class="uc-container">
          <div class="uc-grid">
            <div class="uc-content">
              <JSX.Raw html={typeof html === 'string' ? html : JSX.renderElement(html)} />
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
