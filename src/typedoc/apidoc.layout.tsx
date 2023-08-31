import { DefaultThemeRenderContext, PageEvent, Reflection, RenderTemplate, JSX } from 'typedoc';

export const apiDocLayout = (
  context: DefaultThemeRenderContext,
  template: RenderTemplate<PageEvent<Reflection>>,
  props: PageEvent<Reflection>,
): JSX.Element => (
  <html
    class="default"
    lang={context.options.getValue('htmlLang')}
  >
    <head>
      <meta charSet="utf-8" />
      {context.hook('head.begin')}
      <meta
        http-equiv="x-ua-compatible"
        content="IE=edge"
      />
      <title>{props.model.isProject() ? 'UCNot API' : `${props.model.name} | UCNot API`}</title>
      <meta
        name="description"
        content={'Documentation for ' + props.project.name}
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />

      <link
        rel="stylesheet"
        href={context.relativeURL('assets/style.css', true)}
      />
      <link
        rel="stylesheet"
        href={context.relativeURL('../css/app.css', true)}
      />
      <script
        defer
        src={context.relativeURL('assets/main.js', true)}
      ></script>
      <script
        async
        src={context.relativeURL('assets/search.js', true)}
        id="tsd-search-script"
      ></script>
      {context.hook('head.end')}
    </head>
    <body data-theme="dark">
      {context.hook('body.begin')}
      {context.toolbar(props)}

      <div class="uc-container">
        <div class="uc-grid">
          <div class="uc-content">
            {context.hook('content.begin')}
            {context.header(props)}
            {template(props)}
            {context.hook('content.end')}
          </div>
          <div class="uc-page-menu">
            {context.hook('pageSidebar.begin')}
            {context.pageSidebar(props)}
            {context.hook('pageSidebar.end')}
          </div>
          <div class="uc-site-menu">
            {context.hook('sidebar.begin')}
            {context.sidebar(props)}
            {context.hook('sidebar.end')}
          </div>
        </div>
      </div>

      {context.footer()}

      <div class="overlay"></div>

      {context.analytics()}
      {context.hook('body.end')}
    </body>
  </html>
);
