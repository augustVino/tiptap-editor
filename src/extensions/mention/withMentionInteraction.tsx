import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { MentionItem, MentionListProps } from './types';
import { mapFieldNames } from './utils';

interface MentionInteractionProps {
  items: MentionItem[];
  command: (attrs: Record<string, any>) => void;
  query?: string;
  fieldNames?: { label: string; id: string };
  onSelect?: (item: MentionItem, context: { editor: any; query: string }) => void;
}

export function withMentionInteraction<P extends MentionListProps>(
  WrappedComponent: React.ComponentType<P>,
) {
  const HOC = forwardRef<
    { onKeyDown: (props: { event: KeyboardEvent }) => boolean },
    MentionInteractionProps & Omit<P, keyof MentionListProps>
  >(function MentionInteraction(props, ref) {
    const { items, command, query, fieldNames, onSelect } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

    const list = mapFieldNames(items, fieldNames);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    const selectItem = useCallback(
      (index: number) => {
        const item = list[index];
        if (item) {
          command({
            ...item,
            mentionSuggestionChar: query,
            onSelect,
          });
        }
      },
      [list, command, query, onSelect],
    );

    const registerItemRef = useCallback((index: number, el: HTMLElement) => {
      if (el) {
        itemRefs.current.set(index, el);
      } else {
        itemRefs.current.delete(index);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((i) => (i - 1 + list.length) % list.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((i) => (i + 1) % list.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => {
      const el = itemRefs.current.get(selectedIndex);
      el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const displayProps = {
      list,
      selectedIndex,
      query,
      onItemSelect: selectItem,
      registerItemRef,
    } as P;

    return <WrappedComponent {...displayProps} />;
  });

  HOC.displayName = `withMentionInteraction(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return HOC;
}
