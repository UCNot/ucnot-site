import { TargetLayout } from '../fs/target-layout.js';
import { MenuItem } from '../render/menu.component.js';

export interface SitePage extends MenuItem {
  renderPage(data: SiteData): Promise<void>;
}

export interface SiteData {
  readonly targetLayout: TargetLayout;
  readonly navLinks: readonly MenuItem[];
}
