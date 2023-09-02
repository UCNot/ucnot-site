import { JSX } from 'typedoc';
import { PageContext } from './page-context.js';

export interface MenuItem {
  readonly link: string;
  readonly text: string;
  readonly nested?: MenuItem[] | undefined;
}

export interface MenuProps {
  readonly context: PageContext;
  readonly items?: readonly MenuItem[] | undefined;
  readonly class?: string | undefined;
  readonly nested?: boolean | undefined;
}

export function Menu({
  context,
  items,
  class: className = 'menu',
  nested,
}: MenuProps): JSX.Element {
  if (!items?.length) {
    return <></>;
  }

  return (
    <ul class={nested ? `nested ${className}` : className}>
      {items.map(item => (
        <MenuItem
          context={context}
          item={item}
          menuClass={className}
        />
      ))}
    </ul>
  );
}

function MenuItem({
  context,
  item: { link, text, nested },
  menuClass,
}: {
  readonly context: PageContext;
  readonly item: MenuItem;
  readonly menuClass: string;
}): JSX.Element {
  return (
    <li>
      <a href={context.relative(link)}>{text}</a>
      <Menu
        context={context}
        items={nested}
        class={menuClass}
        nested={true}
      />
    </li>
  );
}
