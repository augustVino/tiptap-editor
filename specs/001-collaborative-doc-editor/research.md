# Research: 多人协作文档编辑器

**Created**: 2025-10-17
**Purpose**: Phase 0 研究 - 解决技术选型和最佳实践问题

## 1. TipTap + Yjs 协作集成方案

### 决策: 使用 TipTap Collaboration 扩展 + Yjs

**理由**:
- TipTap 官方提供 `@tiptap/extension-collaboration` 和 `@tiptap/extension-collaboration-cursor`，原生支持 Yjs
- Yjs 是成熟的 CRDT 库，自动处理并发编辑冲突，无需手动实现 OT (Operational Transformation)
- TipTap 的 ProseMirror 文档模型可以直接映射到 Yjs 的 `Y.XmlFragment`，实现高效的增量同步
- 社区支持良好，有大量生产环境案例（Notion、Linear 等使用类似技术栈）

**架构模式**:
```
Editor Instance (TipTap)
    ↓
Collaboration Extension
    ↓
Y.Doc (Yjs Document)
    ↓
Awareness (用户在线状态)
    ↓
Provider (WebSocket/WebRTC)
    ↓
同步到其他客户端
```

**关键配置**:
- `Y.Doc` 实例在编辑器初始化时创建
- `Y.XmlFragment` 作为编辑器内容的 CRDT 数据结构
- `Awareness` 跟踪协作者光标、选中范围、用户信息
- Provider 负责网络传输（y-websocket、y-webrtc、y-indexeddb）

**替代方案考虑**:
- **ShareDB**: 功能强大但更重，适合复杂后端需求，这里不需要
- **Automerge**: CRDT 库但 JSON 模型不适合富文本增量更新
- **自建 OT 算法**: 实现复杂度高，维护成本大，Yjs 已是工业级解决方案

**参考资源**:
- TipTap Collaboration Guide: https://tiptap.dev/guide/collaborative-editing
- Yjs Documentation: https://docs.yjs.dev/
- Yjs Performance Study: https://blog.kevinjahns.de/are-crdts-suitable-for-shared-editing/

---

## 2. WebSocket vs WebRTC 传输层选择

### 决策: WebSocket (y-websocket) 作为主要方案，WebRTC 作为可选优化

**理由**:
- **WebSocket 优势**:
  - 更简单的部署（只需中心化服务器，不需要 TURN/STUN 服务器）
  - 更好的网络兼容性（企业防火墙通常允许 WebSocket）
  - 更容易监控和调试
  - 支持服务器端持久化（可选）
- **WebRTC 优势**:
  - P2P 传输，减少服务器负载
  - 更低延迟（直连无中转）
  - 但需要信令服务器，网络穿透复杂

**实现策略**:
- MVP 阶段使用 `y-websocket`，部署简单的 WebSocket 服务器（Yjs 提供 y-websocket-server）
- WebSocket 服务器可以内存存储文档状态，或持久化到 Redis
- 后续优化可引入 `y-webrtc` 作为备用传输层（fallback 机制）

**WebSocket 服务器选择**:
- **y-websocket-server** (推荐 MVP): Yjs 官方提供，Node.js 实现，开箱即用
- **自建 Deno/Bun Server**: 性能更好，但需要自己实现 Yjs 协议
- **托管服务**: Liveblocks、Partykit 等 SaaS，快速部署但有成本

**部署架构**:
```
Browser A ←→ WebSocket Server ←→ Browser B
             ↑
             └─→ IndexedDB/Redis (可选持久化)
```

**性能优化**:
- WebSocket 服务器使用消息压缩（gzip/brotli）
- 实现心跳机制，及时清理离线用户
- 对大文档使用 Yjs 的增量更新（只同步变更部分）

**参考资源**:
- y-websocket: https://github.com/yjs/y-websocket
- y-websocket-server 示例: https://github.com/yjs/y-websocket/tree/master/bin

---

## 3. 表格扩展实现方案

### 决策: 使用 @tiptap/extension-table + 自定义菜单组件

**理由**:
- TipTap 官方提供 `@tiptap/extension-table`，支持基础表格功能（插入、删除行列、合并单元格）
- 官方扩展已处理 ProseMirror 表格模型的复杂性（TableMap、TableView）
- 可以通过自定义 Node View 添加表格工具栏（悬浮菜单）
- 与协作扩展兼容，Yjs 可以正确同步表格结构变更

**功能映射**:
| 规格需求 (FR-006, FR-007) | TipTap 实现 |
|--------------------------|------------|
| 插入表格（指定行列）       | `editor.chain().insertTable({ rows, cols }).run()` |
| 编辑单元格内容            | 默认支持，单元格内可应用格式 |
| 插入/删除行              | `addRowBefore()`, `addRowAfter()`, `deleteRow()` |
| 插入/删除列              | `addColumnBefore()`, `addColumnAfter()`, `deleteColumn()` |
| Tab 键导航              | `goToNextCell()`, `goToPreviousCell()` |

**自定义组件**:
- **TableMenu.tsx**: 悬浮菜单，鼠标悬停在表格上时显示，提供行列操作按钮
- **TableCellMenu.tsx**: 单元格右键菜单，提供合并单元格、对齐等选项
- **TableSizeSelector.tsx**: 插入表格时的行列选择器（类似 Word/Notion）

**性能考虑**:
- 表格最大支持 10x10（规格要求），不需要虚拟滚动
- 大表格（>50 单元格）使用懒加载渲染（只渲染可见单元格）
- 表格操作（插入行列）使用 `requestIdleCallback` 避免阻塞主线程

**替代方案考虑**:
- **ProseMirror-tables 直接使用**: 更底层，灵活性高但实现复杂
- **自建表格扩展**: 重复造轮子，维护成本高
- **使用 React 组件模拟表格**: 与编辑器模型不兼容，协作同步困难

**参考资源**:
- TipTap Table Guide: https://tiptap.dev/api/nodes/table
- ProseMirror Table Example: https://prosemirror.net/examples/table/

---

## 4. 性能优化策略

### 目标: 满足 Constitution 性能要求

| 指标 | 目标 | 优化策略 |
|-----|------|---------|
| 编辑器初始化 | <200ms | 代码分割，按需加载表格扩展；使用 `React.lazy` 懒加载侧边栏 |
| 字符输入延迟 | <16ms | 避免同步 DOM 操作，使用 TipTap 的虚拟 DOM；debounce 协作同步（10ms）|
| 格式应用响应 | <100ms | 使用 `editor.chain()` 批量命令；避免在格式函数中进行 I/O |
| 协作同步延迟 | <1秒 | WebSocket 使用二进制协议；Yjs 增量更新；压缩消息 |
| Bundle Size | <150KB gzipped | Tree-shaking 未使用的 TipTap 扩展；移除 Moment.js 等大依赖 |

**代码分割策略**:
```typescript
// 核心编辑器（立即加载）
import { Editor } from '@tiptap/core'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'

// 表格扩展（懒加载）
const Table = lazy(() => import('@tiptap/extension-table'))

// 协作扩展（按需加载）
const Collaboration = lazy(() => import('./extensions/collaboration'))
```

**性能监控**:
- 使用 `performance.mark()` 和 `performance.measure()` 监控关键路径
- 集成 Lighthouse CI，每次构建检查 bundle size 和性能分数
- 使用 React DevTools Profiler 识别慢组件

**内存优化**:
- 编辑器销毁时清理 Yjs 事件监听器（`doc.destroy()`）
- 使用 `WeakMap` 缓存协作者颜色映射
- 限制 Undo/Redo 历史记录为 50 步（规格要求）

**Yjs 性能优化**:
- 启用 `y-indexeddb` 本地持久化，减少网络同步量
- 使用 `Y.encodeStateAsUpdate()` 进行二进制序列化，而非 JSON
- 大文档使用 Yjs 的 GC (Garbage Collection) 清理历史数据

**参考资源**:
- Yjs Performance Tips: https://docs.yjs.dev/api/faq#performance
- TipTap Performance Guide: https://tiptap.dev/guide/performance
- React Performance Optimization: https://react.dev/learn/render-and-commit#optimizing-performance

---

## 5. TypeScript 严格模式迁移策略

### 决策: 渐进式启用 strict mode

**理由**:
- 当前项目 `strict: false`，全局启用会导致大量错误
- 新代码模块独立配置 strict，避免影响现有代码
- 使用 TypeScript 的 Project References 实现分模块配置

**实施步骤**:
1. 创建 `tsconfig.strict.json` 继承主配置，启用 `strict: true`
2. 新模块（`src/editor/`, `src/extensions/`, `src/collaboration/`）引用 strict 配置
3. 为关键类型提供严格定义（Document、Collaborator、EditorConfig）
4. 使用类型守卫（type guards）处理边界情况

**示例配置**:
```json
// tsconfig.strict.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "include": [
    "src/editor/**/*",
    "src/extensions/**/*",
    "src/collaboration/**/*"
  ]
}
```

**关键类型定义**:
- 使用 `unknown` 代替 `any`
- 为 TipTap 扩展选项定义明确接口
- Yjs 事件回调函数提供类型签名

**参考资源**:
- TypeScript Strict Mode: https://www.typescriptlang.org/tsconfig#strict
- Project References: https://www.typescriptlang.org/docs/handbook/project-references.html

---

## 6. IME（输入法）兼容性处理

### 问题: 中文/日文/韩文输入法在富文本编辑器中的特殊处理

**挑战**:
- IME 输入过程中会触发多次 `input` 事件
- 协作同步可能在 IME 输入未确认时发送中间状态
- 快捷键（Ctrl+B）可能在 IME 激活时误触发

**解决方案**:
1. **监听 CompositionEvent**:
   ```typescript
   editor.on('compositionstart', () => {
     // 暂停协作同步
     pauseSync()
   })

   editor.on('compositionend', () => {
     // 恢复协作同步，发送最终输入
     resumeSync()
   })
   ```

2. **快捷键过滤**:
   ```typescript
   editor.registerKeyboardShortcut({
     'Mod-b': () => {
       if (isComposing) return false // IME 激活时忽略快捷键
       return editor.commands.toggleBold()
     }
   })
   ```

3. **Yjs 协作延迟**:
   - 使用 `debounce(100ms)` 延迟协作同步，给 IME 输入留出确认时间
   - Yjs 的 `Awareness` 不同步 IME 中间状态

**测试**:
- 使用中文拼音输入法测试长句输入
- 测试 IME 激活时按 Ctrl+B 不应触发加粗
- 测试多用户同时使用 IME 输入，协作同步正确

**参考资源**:
- MDN CompositionEvent: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
- ProseMirror Input Handling: https://prosemirror.net/docs/guide/#input-handling

---

## 7. 离线编辑与自动同步

### 决策: 使用 y-indexeddb + 网络状态监听

**实现策略**:
1. **三层存储架构**:
   - **内存**: Yjs Y.Doc 实例（当前编辑状态）
   - **IndexedDB**: y-indexeddb 持久化（离线缓存）
   - **WebSocket**: 远程同步（在线时）

2. **网络状态监听**:
   ```typescript
   window.addEventListener('online', () => {
     // 网络恢复，重新连接 WebSocket
     websocketProvider.connect()
     // 自动同步离线期间的编辑
   })

   window.addEventListener('offline', () => {
     // 网络断开，切换到离线模式
     showOfflineIndicator()
   })
   ```

3. **冲突解决**:
   - Yjs 的 CRDT 算法自动合并离线编辑和远程更改
   - 使用 Lamport 时间戳确保操作顺序一致性
   - 离线编辑在重新连接时自动推送到服务器

**用户体验**:
- 在工具栏显示"离线"徽章，提示用户当前状态
- 重新连接时显示"同步中..."加载指示器
- 同步完成后显示"已同步"确认消息（3秒后自动消失）

**数据完整性**:
- IndexedDB 使用 `Y.encodeStateAsUpdate()` 二进制存储
- 定期清理旧文档数据（30天未访问）
- 提供"导出文档"功能，用户可手动备份

**参考资源**:
- y-indexeddb: https://github.com/yjs/y-indexeddb
- Network Information API: https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API

---

## 总结

所有技术选型和最佳实践已明确，Phase 0 研究完成。关键决策：
1. ✅ TipTap + Yjs 协作集成（官方扩展）
2. ✅ WebSocket 传输层（y-websocket）
3. ✅ 官方表格扩展 + 自定义菜单
4. ✅ 性能优化策略（代码分割、Yjs 增量更新）
5. ✅ 渐进式 TypeScript strict mode
6. ✅ IME 兼容性处理（CompositionEvent）
7. ✅ 离线编辑（y-indexeddb + 网络监听）

**下一步**: Phase 1 - 生成 data-model.md、contracts/、quickstart.md
