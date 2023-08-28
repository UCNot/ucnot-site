import { SourceDir } from './source-dir.js';

export interface SourceLayout {
  rootDir(): SourceDir;
  contentDir(): SourceDir;
  templatesDir(): SourceDir;
}
