import { PageEvent, Reflection } from 'typedoc';
import { JSX } from 'typedoc';
import { ApiDocThemeRenderContext } from './apidoc.theme.js';

export function apiDocToolbar(
  context: ApiDocThemeRenderContext,
  _props: PageEvent<Reflection>,
): JSX.Element {
  return (
    <header class="uc-top-bar tsd-page-toolbar">
      <div class="tsd-toolbar-contents container">
        <div
          class="table-cell"
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

          <div class="field">
            <div id="tsd-toolbar-links">
              {Object.entries(context.options.getValue('navigationLinks')).map(([label, url]) => (
                <a href={url}>{label}</a>
              ))}
            </div>
          </div>

          <ul class="results">
            <li class="state loading">Preparing search index...</li>
            <li class="state failure">The search index is not available</li>
          </ul>

          <a
            href={context.pageContext.relative('/index.html')}
            class="title"
            title="URI Charge Notation"
          >
            UCNot
          </a>
        </div>

        <div
          class="table-cell"
          id="tsd-widgets"
        >
          <a
            href="#"
            class="tsd-widget tsd-toolbar-icon menu no-caption"
            data-toggle="menu"
            aria-label="Menu"
          >
            {context.icons.menu()}
          </a>
        </div>
      </div>
    </header>
  );
}
