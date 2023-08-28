export interface TargetFile {
  readonly path: string;
  writeText(text: string): Promise<void>;
}
