export interface HtmlTemplate<in TData extends HtmlTemplateData> {
  renderHtml(data: TData): Promise<string>;
}

export interface HtmlTemplateData {
  readonly [key: string]: unknown;
}
