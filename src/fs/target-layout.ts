import { TargetDir } from './target-dir.js';

export interface TargetLayout {
  rootDir(): TargetDir;
  siteDir(): TargetDir;
}
