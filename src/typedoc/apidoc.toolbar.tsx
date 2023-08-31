import { PageEvent, Reflection } from 'typedoc';
import { JSX } from 'typedoc';
import { TopBar } from '../render/top-bar.component.js';
import { ApiDocThemeRenderContext } from './apidoc.theme.js';

export function apiDocToolbar(
  context: ApiDocThemeRenderContext,
  _props: PageEvent<Reflection>,
): JSX.Element {
  return (
    <TopBar context={context.pageContext}>
      <div
        id="tsd-search"
        data-base={context.relativeURL('./')}
      >
        <div class="field">
          <label
            for="tsd-search-field"
            class="tsd-widget tsd-toolbar-icon search no-caption"
          >
            {context.icons.search()}
          </label>
          <input
            type="text"
            id="tsd-search-field"
            aria-label="Search"
          />
        </div>

        <ul class="results">
          <li class="state loading">Preparing search index...</li>
          <li class="state failure">The search index is not available</li>
        </ul>
      </div>

      <>
        <a
          href="#"
          class="tsd-widget tsd-toolbar-icon menu no-caption"
          data-toggle="menu"
          aria-label="Menu"
        >
          {context.icons.menu()}
        </a>
      </>
    </TopBar>
  );
}
