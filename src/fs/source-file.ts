export interface SourceFile {
  readonly path: string;
  extname(): string;
  readText(): Promise<string>;
}
