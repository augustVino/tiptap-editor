import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { List } from '../List';

vi.mock('../List.module.less', () => ({
  default: {
    list: 'list',
    item: 'item',
    selected: 'selected',
    empty: 'empty',
  },
}));

describe('List', () => {
  afterEach(cleanup);

  it('should render items with labels', () => {
    const items = [
      { label: 'Alice', id: '1' },
      { label: 'Bob', id: '2' },
    ];
    render(
      <List
        list={items as any}
        selectedIndex={0}
        onItemSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('should show custom emptyText when list is empty', () => {
    render(
      <List
        list={[]}
        selectedIndex={0}
        onItemSelect={vi.fn()}
        emptyText="No results"
      />,
    );
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('should show default empty text when list is empty and no emptyText provided', () => {
    render(
      <List list={[]} selectedIndex={0} onItemSelect={vi.fn()} />,
    );
    expect(screen.getByText('暂无匹配结果')).toBeTruthy();
  });
});
