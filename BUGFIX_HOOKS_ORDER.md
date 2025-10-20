# React Hooks 顺序错误修复

## 问题描述

在实现 `CollaborativeEditorProvider` 时遇到 React Hooks 规则违反错误：

```
Warning: React has detected a change in the order of Hooks called by CollaborativeEditorContent.
Uncaught Error: Rendered more hooks than during the previous render.
```

## 错误原因

### 根本原因

违反了 **React Hooks 规则**：Hooks 必须在每次渲染时以相同的顺序调用。

### 具体问题

在 `CollaborativeEditorContent` 组件中，当 `collaborationConfig` 从 `undefined` 变为有值时：

1. **第一次渲染**（`collaborationConfig` 为 `undefined`）：
   - 调用 `useEditor` 时传入 `collaboration: undefined`
   - `useEditor` 内部的 `extensions` 不包含协作扩展
   - 使用较少的 hooks

2. **第二次渲染**（`collaborationConfig` 有值）：
   - 调用 `useEditor` 时传入 `collaboration: {...}`
   - `useEditor` 内部的 `extensions` 包含协作扩展
   - 使用更多的 hooks（协作扩展内部有额外的 hooks）

这导致两次渲染的 hooks 数量和顺序不一致，违反了 React 规则。

### 代码示例（错误的）

```tsx
function CollaborativeEditorContent(props) {
  const collaborationConfig = useMemo(() => {
    if (!awarenessManager || !wsProvider) return undefined
    return { ydoc, wsProvider, awareness, user }
  }, [deps])

  // ❌ 错误：collaborationConfig 变化会导致 hooks 数量变化
  const editor = useEditor({
    collaboration: collaborationConfig  // undefined → {...}
  })

  if (!collaborationConfig) {
    return <div>加载中...</div>
  }

  return <EditorUI />
}
```

## 解决方案

### 方法：条件渲染分离

将编辑器的初始化移到单独的组件中，只在协作配置准备好后才渲染该组件。

### 实现

```tsx
function CollaborativeEditorContent(props) {
  const collaborationConfig = useMemo(() => {
    if (!awarenessManager || !wsProvider) return undefined
    return { ydoc, wsProvider, awareness, user }
  }, [deps])

  // ✅ 正确：在配置准备好之前就提前返回，不渲染编辑器组件
  if (!collaborationConfig) {
    return <div>正在连接协作服务器...</div>
  }

  // 配置准备好后才渲染编辑器组件
  return <EditorWrapper collaborationConfig={collaborationConfig} {...props} />
}

// 单独的编辑器组件，只在 collaborationConfig 存在时渲染
function EditorWrapper(props) {
  // ✅ 此时 collaborationConfig 一定存在且不会变化
  const editor = useEditor({
    collaboration: props.collaborationConfig  // 始终有值
  })

  return <EditorUI editor={editor} />
}
```

## 关键改进点

1. **提前返回**：在 `collaborationConfig` 未准备好时直接返回加载状态
2. **组件分离**：将编辑器初始化逻辑放在单独的 `EditorWrapper` 组件中
3. **稳定的 props**：`EditorWrapper` 接收的 `collaborationConfig` 始终有值且稳定
4. **Hooks 一致性**：`useEditor` 每次调用时都使用相同的协作配置结构

## 为什么这样解决

### React Hooks 规则

React 要求：
- Hooks 必须在组件顶层调用
- Hooks 的调用顺序必须在每次渲染时保持一致
- 不能在条件语句、循环或嵌套函数中调用 Hooks

### 我们的场景

- `useEditor` 内部根据 `collaboration` 是否存在来决定添加哪些扩展
- 协作扩展内部使用了额外的 hooks
- 当 `collaboration` 从无到有时，hooks 数量发生变化

### 正确的做法

**条件渲染而不是条件调用**：
- ❌ 错误：条件性地改变 hook 的参数（导致内部 hooks 变化）
- ✅ 正确：条件性地渲染组件（不同组件有独立的 hooks）

## 相关文件

修改的文件：
- `src/editor/CollaborativeEditorProvider.tsx` - 拆分为两个组件
- `src/editor/index.ts` - 修正导出名称

## 验证

```bash
# 类型检查通过
pnpm type-check

# 开发服务器正常运行
pnpm dev
```

## 教训总结

1. **理解 React Hooks 规则**：hooks 必须保持调用顺序一致
2. **避免动态 hooks**：不要让 hook 内部的逻辑因参数变化而改变 hooks 数量
3. **使用条件渲染**：通过渲染不同的组件来处理不同状态
4. **组件职责单一**：一个组件只负责一个明确的渲染状态

## 参考资料

- [React Hooks 规则](https://reactjs.org/docs/hooks-rules.html)
- [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)
