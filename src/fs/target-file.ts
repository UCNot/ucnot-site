export interface TargetFile {
  readonly path: string;
  readonly link: string;

  writeText(text: string): Promise<void>;
}
