import { JSX } from 'typedoc';
import { PageContext } from './page-context.js';

export function TopBar({
  context,
  children,
}: {
  readonly context: PageContext;
  readonly children?: JSX.Element[] | undefined;
}): JSX.Element {
  return (
    <div class="top-bar">
      <div class="top-bar-left">
        <a href={context.relative('/index.html')}>UCNot</a>
      </div>
      <div class="top-bar-right">
        <ul class="menu">
          <li>
            <a href={context.relative('/api-doc/index.html')}>API Docs</a>
          </li>
          {children?.map((item: JSX.Element) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
