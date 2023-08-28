export interface SourceFile {
  readonly path: string;
  readText(): Promise<string>;
}
