import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { MentionItem, CommandArgs, MentionListPureDisplayProps } from './types';
import { mapFieldNames } from './utils';

interface MentionInteractionProps {
  /** mention项目列表 */
  items: MentionItem[];
  /** 自定义样式类名 */
  className?: string;
  /** 触发字符 */
  text: string;
  /** mention命令回调 */
  command: (props: CommandArgs) => void;
  /** 选中回调 */
  onSelect?: CommandArgs['onSelect'];
  /** 字段名映射配置 */
  fieldNames?: Record<string, any>;
  /** 查询字符 */
  query?: string;
}

interface MentionListComponentRef {
  onKeyDown: (event: { event: KeyboardEvent }) => boolean;
}

/**
 * 高阶组件：为纯展示组件注入交互逻辑
 * @param WrappedComponent 用户提供的纯展示组件
 * @returns 增强后的组件（包含完整交互逻辑）
 */
export function withMentionInteraction(
  WrappedComponent: React.ComponentType<MentionListPureDisplayProps>
) {
  const EnhancedComponent = forwardRef<
    MentionListComponentRef,
    MentionListPureDisplayProps & MentionInteractionProps
  >((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<Array<HTMLElement>>([]);

    const { items, command, text, onSelect, fieldNames } = props;

    const list = React.useMemo(() => {
      const mappedList = mapFieldNames(items, fieldNames);
      console.log('withMentionInteraction: list mapped', {
        originalItems: items,
        mappedList,
        itemsLength: items?.length,
        mappedLength: mappedList?.length
      });
      return mappedList;
    }, [items, fieldNames]);

    // 选择项目
    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (item) {
          command({ ...item, mentionSuggestionChar: text, source: JSON.stringify(item), onSelect });
        }
      },
      [items, text, command, onSelect]
    );

    // 滚动到选中项
    const scrollSelectedIntoView = useCallback((index: number) => {
      const selectedElement = itemRefs.current[index];
      if (selectedElement) {
        selectedElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, []);

    // 键盘导航处理函数
    const upHandler = useCallback(() => {
      setSelectedIndex((prevIndex) => (prevIndex + items.length - 1) % items.length);
    }, [items.length]);

    const downHandler = useCallback(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, [items.length]);

    const enterHandler = useCallback(() => {
      selectItem(selectedIndex);
    }, [selectedIndex, selectItem]);

    // 处理项目选择
    const handleItemSelect = useCallback(
      (index: number) => {
        selectItem(index);
      },
      [selectItem]
    );

    // 当items变化时重置选中索引
    useEffect(() => {
      setSelectedIndex(0);
      return () => {
        itemRefs.current = [];
      };
    }, [items]);

    // 当选中项变化时，滚动到可视区域
    useEffect(() => {
      if (items.length > 0) {
        scrollSelectedIntoView(selectedIndex);
      }
    }, [selectedIndex, items, scrollSelectedIntoView]);

    // 暴露键盘交互接口给ReactRenderer
    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        const keysHandler = {
          ArrowUp: upHandler,
          ArrowDown: downHandler,
          Enter: enterHandler
        };
        const key = event.key as keyof typeof keysHandler;
        if (keysHandler[key]) {
          keysHandler[key]();
          return true;
        }
        return false;
      }
    }));

    const registerItemRef = useCallback((index: number, ref: HTMLElement) => {
      if (ref) {
        itemRefs.current[index] = ref;
      } else {
        delete itemRefs.current[index];
      }
    }, []);

    // 为用户组件注入交互逻辑Props
    const enhancedProps = {
      //   ...props,
      query: props?.query ?? '',
      list,
      selectedIndex,
      onItemSelect: handleItemSelect,
      registerItemRef
    } as MentionListPureDisplayProps;

    return <WrappedComponent {...enhancedProps} />;
  });

  EnhancedComponent.displayName = `withMentionInteraction(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return EnhancedComponent;
}
