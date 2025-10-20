# Tasks: 多人协作文档编辑器

**Input**: Design documents from `/specs/001-collaborative-doc-editor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 包含测试任务，符合 Constitution Testing Discipline 要求（TipTap 扩展、Yjs 协作同步、编辑器状态转换为 MANDATORY 测试区域）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root（本项目采用此结构）

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install TipTap and Yjs dependencies via pnpm (yjs, @tiptap/react, @tiptap/starter-kit, @tiptap/extension-collaboration, @tiptap/extension-collaboration-cursor, @tiptap/extension-table, @tiptap/extension-text-align, @tiptap/extension-underline, @tiptap/extension-placeholder, y-websocket, y-indexeddb)
- [ ] T002 Install testing dependencies via pnpm (vitest, @testing-library/react, @testing-library/jest-dom, @vitest/ui)
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json for new modules
- [ ] T004 [P] Configure Vitest in vitest.config.ts
- [ ] T005 [P] Create directory structure (src/editor/, src/extensions/, src/collaboration/, src/components/, src/utils/, src/types/, tests/unit/, tests/integration/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Create global type definitions in src/types/document.ts (Document, JSONContent, Mark interfaces)
- [ ] T007 [P] Create collaborator types in src/types/collaborator.ts (Collaborator, CollaboratorStatus, EditorSelection interfaces)
- [ ] T008 [P] Create format types in src/types/format.ts (TextFormat, BlockFormat, TextFormatType, BlockFormatType enums)
- [ ] T009 [P] Create editor state types in src/types/editorState.ts (EditorState, ConnectionStatus enum)
- [ ] T010 [P] Create editor config types in src/types/editorConfig.ts (EditorConfig, ExtensionConfig, CollaborationConfig, PerformanceConfig interfaces)
- [ ] T011 Export all types from src/types/index.ts
- [ ] T012 [P] Create utility function for document ID generation in src/utils/documentId.ts
- [ ] T013 [P] Create color palette utility for collaborator colors in src/utils/colorPalette.ts (5+ colors)
- [ ] T014 [P] Create performance monitoring utility in src/utils/performance.ts (for tracking initialization time, format apply time)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 基础富文本编辑 (Priority: P1) 🎯 MVP

**Goal**: 用户可以在编辑器中创建和编辑文档，使用基本的文本格式化功能（加粗、斜体、标题）

**Independent Test**: 用户打开编辑器，输入文本，应用格式（加粗、斜体、标题），保存文档，刷新页面后内容保持不变

### Tests for User Story 1 (MANDATORY - Constitution要求) ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Integration test for editor initialization in tests/integration/editor-initialization.test.ts (test editor mounts, is editable, shows placeholder)
- [ ] T016 [P] [US1] Unit test for Bold extension in tests/unit/extensions/Bold.test.ts (test toggleBold, isActive)
- [ ] T017 [P] [US1] Unit test for Italic extension in tests/unit/extensions/Italic.test.ts (test toggleItalic, isActive)
- [ ] T018 [P] [US1] Unit test for Heading extension in tests/unit/extensions/Heading.test.ts (test setHeading levels 1-3, isActive)

### Implementation for User Story 1

- [ ] T019 [P] [US1] Create EditorConfig.ts in src/editor/EditorConfig.ts (default configuration, validation functions)
- [ ] T020 [P] [US1] Create editor types in src/editor/types.ts (EditorInstance, EditorProps interfaces)
- [ ] T021 [US1] Implement useEditor Hook in src/editor/useEditor.ts (TipTap initialization, extension configuration, state management) - depends on T019, T020
- [ ] T022 [P] [US1] Create Bold extension wrapper in src/extensions/formatting/Bold.ts
- [ ] T023 [P] [US1] Create Italic extension wrapper in src/extensions/formatting/Italic.ts
- [ ] T024 [P] [US1] Create Underline extension wrapper in src/extensions/formatting/Underline.ts
- [ ] T025 [P] [US1] Create Strike extension wrapper in src/extensions/formatting/Strike.ts
- [ ] T026 [P] [US1] Create Heading extension wrapper in src/extensions/formatting/Heading.ts (levels 1-3)
- [ ] T027 Export formatting extensions from src/extensions/formatting/index.ts
- [ ] T028 [US1] Create EditorProvider component in src/editor/EditorProvider.tsx (React Context for editor instance) - depends on T021
- [ ] T029 [P] [US1] Create EditorContainer component in src/components/Editor/EditorContainer.tsx
- [ ] T030 [P] [US1] Create EditorContent component in src/components/Editor/EditorContent.tsx
- [ ] T031 [P] [US1] Create EditorPlaceholder component in src/components/Editor/EditorPlaceholder.tsx
- [ ] T032 [US1] Create base Toolbar component in src/components/Toolbar/Toolbar.tsx (empty layout structure)
- [ ] T033 [P] [US1] Create ToolbarButton component in src/components/Toolbar/ToolbarButton.tsx (reusable button with icon + tooltip)
- [ ] T034 [P] [US1] Create ToolbarDivider component in src/components/Toolbar/ToolbarDivider.tsx
- [ ] T035 [US1] Create FormattingTools component in src/components/Toolbar/FormattingTools.tsx (Bold, Italic, Underline, Strike buttons) - depends on T033
- [ ] T036 [P] [US1] Create Button component in src/components/common/Button.tsx
- [ ] T037 [P] [US1] Create Tooltip component in src/components/common/Tooltip.tsx
- [ ] T038 [US1] Update App.tsx to integrate EditorProvider, EditorContent, and Toolbar (replace old demo code)
- [ ] T039 [P] [US1] Create editor styles in src/components/Editor/EditorContent.module.less (content area, heading styles)
- [ ] T040 [P] [US1] Create toolbar styles in src/components/Toolbar/Toolbar.module.less (button layout, grouping)
- [ ] T041 [US1] Add keyboard shortcut handling for Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U in useEditor Hook

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. User can open editor, type text, apply bold/italic/heading formats, and content persists in browser.

---

## Phase 4: User Story 2 - 实时多人协作 (Priority: P2)

**Goal**: 多个用户可以同时编辑同一文档，实时看到彼此的更改，包括光标位置和在线状态

**Independent Test**: 在两个不同的浏览器窗口中打开同一文档，在一个窗口中编辑内容，另一个窗口应立即（1秒内）显示更改

### Tests for User Story 2 (MANDATORY - Constitution要求) ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T042 [P] [US2] Integration test for collaboration sync in tests/integration/collaboration-sync.test.ts (test two editors sync, CRDT conflict resolution)
- [ ] T043 [P] [US2] Integration test for offline recovery in tests/integration/offline-recovery.test.ts (test IndexedDB persistence, network reconnection)
- [ ] T044 [P] [US2] Unit test for AwarenessManager in tests/unit/collaboration/AwarenessManager.test.ts (test user join/leave, cursor update)

### Implementation for User Story 2

- [ ] T045 [P] [US2] Create collaboration types in src/collaboration/types.ts (YjsProviderProps, WebSocketConfig interfaces)
- [ ] T046 [US2] Implement WebSocketProvider wrapper in src/collaboration/WebSocketProvider.ts (y-websocket integration, connection management) - depends on T045
- [ ] T047 [US2] Implement IndexedDBProvider wrapper in src/collaboration/IndexedDBProvider.ts (y-indexeddb integration, offline persistence) - depends on T045
- [ ] T048 [US2] Implement AwarenessManager in src/collaboration/AwarenessManager.ts (track online users, cursor positions, status updates) - depends on T046
- [ ] T049 [US2] Create CollaborationExtension in src/extensions/collaboration/CollaborationExtension.ts (Yjs Collaboration integration with TipTap)
- [ ] T050 [US2] Create CollaborationCursor extension in src/extensions/collaboration/CollaborationCursor.ts (display other users' cursors)
- [ ] T051 Export collaboration extensions from src/extensions/collaboration/index.ts
- [ ] T052 [US2] Create YjsProvider React component in src/collaboration/YjsProvider.tsx (provide Yjs doc and providers to context) - depends on T046, T047, T048
- [ ] T053 [US2] Update useEditor Hook to integrate Collaboration and CollaborationCursor extensions
- [ ] T054 [P] [US2] Create CollaboratorAvatar component in src/components/Sidebar/CollaboratorAvatar.tsx
- [ ] T055 [US2] Create CollaboratorList component in src/components/Sidebar/CollaboratorList.tsx (display online users) - depends on T054
- [ ] T056 [US2] Update EditorProvider to wrap children with YjsProvider
- [ ] T057 [US2] Update App.tsx to add CollaboratorList to sidebar
- [ ] T058 [P] [US2] Create collaboration cursor styles in src/components/Editor/CollaborationCursor.module.less (cursor color, label)
- [ ] T059 [P] [US2] Create collaborator list styles in src/components/Sidebar/CollaboratorList.module.less
- [ ] T060 [US2] Implement network status indicator in src/components/common/NetworkStatus.tsx (show connected/offline/connecting state)
- [ ] T061 [US2] Add IME (Input Method Editor) composition event handling in useEditor Hook (pause sync during composition, resume on compositionend)
- [ ] T062 [US2] Implement debounced sync for collaboration (100ms debounce to avoid excessive network calls)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Two users can open the same document URL, edit simultaneously, see each other's changes in <1 second, see cursors, and continue editing offline.

---

## Phase 5: User Story 3 - 高级格式与内容对齐 (Priority: P3)

**Goal**: 用户可以使用高级格式化选项，包括文本对齐、有序/无序列表、代码块

**Independent Test**: 用户在编辑器中创建包含多种格式的文档：标题居中、段落左对齐、代码块、列表。刷新后格式保持

### Tests for User Story 3 (MANDATORY for extensions) ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T063 [P] [US3] Unit test for TextAlign extension in tests/unit/extensions/TextAlign.test.ts (test setTextAlign left/center/right/justify, isActive)
- [ ] T064 [P] [US3] Unit test for OrderedList extension in tests/unit/extensions/OrderedList.test.ts (test toggleOrderedList, nesting)
- [ ] T065 [P] [US3] Unit test for BulletList extension in tests/unit/extensions/BulletList.test.ts (test toggleBulletList, nesting)
- [ ] T066 [P] [US3] Unit test for CodeBlock extension in tests/unit/extensions/CodeBlock.test.ts (test toggleCodeBlock, preserve indentation)

### Implementation for User Story 3

- [ ] T067 [P] [US3] Create TextAlign extension wrapper in src/extensions/formatting/TextAlign.ts
- [ ] T068 [P] [US3] Create OrderedList extension wrapper in src/extensions/blocks/OrderedList.ts
- [ ] T069 [P] [US3] Create BulletList extension wrapper in src/extensions/blocks/BulletList.ts
- [ ] T070 [P] [US3] Create ListItem extension wrapper in src/extensions/blocks/ListItem.ts
- [ ] T071 [P] [US3] Create CodeBlock extension wrapper in src/extensions/blocks/CodeBlock.ts
- [ ] T072 Export block extensions from src/extensions/blocks/index.ts
- [ ] T073 [US3] Update useEditor Hook to add TextAlign, OrderedList, BulletList, ListItem, CodeBlock extensions
- [ ] T074 [US3] Create BlockTools component in src/components/Toolbar/BlockTools.tsx (Heading dropdown, TextAlign buttons, List buttons, CodeBlock button) - depends on T033
- [ ] T075 [US3] Update Toolbar component to include BlockTools
- [ ] T076 [P] [US3] Create code block styles in src/components/Editor/CodeBlock.module.less (monospace font, dark background, syntax highlighting)
- [ ] T077 [P] [US3] Create list styles in src/components/Editor/List.module.less (indentation, nested list styles)
- [ ] T078 [US3] Add keyboard shortcuts for lists (Ctrl/Cmd+Shift+7 ordered, Ctrl/Cmd+Shift+8 bullet) and code block (Ctrl/Cmd+Shift+C) in useEditor Hook
- [ ] T079 [US3] Add Tab key handling for list nesting in useEditor Hook

**Checkpoint**: All user stories 1-3 should now be independently functional. User can create complex documents with headings, aligned text, lists, and code blocks.

---

## Phase 6: User Story 4 - 表格插入与编辑 (Priority: P4)

**Goal**: 用户可以在文档中插入表格，编辑单元格内容，添加/删除行列

**Independent Test**: 用户插入一个3x3表格，填充内容，添加一行，删除一列，表格结构和内容正确维护

### Tests for User Story 4 (MANDATORY for table extension) ⚠️

**NOTE**: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T080 [P] [US4] Unit test for Table extension in tests/unit/extensions/Table.test.ts (test insertTable, deleteTable, table constraints max 10x10)
- [ ] T081 [P] [US4] Unit test for table operations in tests/unit/extensions/TableOperations.test.ts (test addRowBefore/After, deleteRow, addColumnBefore/After, deleteColumn)

### Implementation for User Story 4

- [ ] T082 [P] [US4] Create table types in src/types/table.ts (Table, TableRow, TableCell, TableAttrs, TableCellAttrs interfaces)
- [ ] T083 [P] [US4] Create Table extension wrapper in src/extensions/table/Table.ts (with max 10x10 constraint)
- [ ] T084 [P] [US4] Create TableRow extension wrapper in src/extensions/table/TableRow.ts
- [ ] T085 [P] [US4] Create TableCell extension wrapper in src/extensions/table/TableCell.ts
- [ ] T086 [P] [US4] Create TableHeader extension wrapper in src/extensions/table/TableHeader.ts
- [ ] T087 [US4] Create TableMenu component in src/extensions/table/TableMenu.tsx (floating menu for table operations: add/delete row/column, merge cells) - depends on T037
- [ ] T088 Export table extensions from src/extensions/table/index.ts
- [ ] T089 [US4] Update useEditor Hook to add Table, TableRow, TableCell, TableHeader extensions
- [ ] T090 [US4] Create TableTools component in src/components/Toolbar/TableTools.tsx (Insert Table button with row/col selector) - depends on T033
- [ ] T091 [US4] Update Toolbar component to include TableTools
- [ ] T092 [P] [US4] Create table styles in src/components/Editor/Table.module.less (border, cell padding, header background)
- [ ] T093 [P] [US4] Create table menu styles in src/extensions/table/TableMenu.module.less (floating menu positioning)
- [ ] T094 [US4] Add keyboard shortcuts for table navigation (Tab for goToNextCell, Shift+Tab for goToPreviousCell) in useEditor Hook
- [ ] T095 [US4] Implement table size selector UI component in src/components/Toolbar/TableSizeSelector.tsx (grid selector like Word/Notion)

**Checkpoint**: All user stories 1-4 should now be independently functional. User can create documents with full formatting including tables.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T096 [P] Create Icon component in src/components/common/Icon.tsx (reusable icon wrapper, support for SVG icons)
- [ ] T097 [P] Implement storage utility for IndexedDB in src/utils/storage.ts (wrapper functions for y-indexeddb operations)
- [ ] T098 [P] Add error boundary component in src/components/common/ErrorBoundary.tsx (catch and display editor errors gracefully)
- [ ] T099 Add global error handling for editor in src/editor/useEditor.ts (listen to 'error' event, display user-friendly messages)
- [ ] T100 [P] Implement word count utility in src/utils/wordCount.ts (calculate wordCount from editor content)
- [ ] T101 Update EditorProvider to expose word count in context
- [ ] T102 [P] Create word count display component in src/components/Editor/WordCount.tsx (display character and word count)
- [ ] T103 [P] Optimize bundle size: implement code splitting for Table extension (lazy load via React.lazy)
- [ ] T104 [P] Add performance monitoring: track editor initialization time, format apply time using src/utils/performance.ts
- [ ] T105 [P] Add ARIA labels to all toolbar buttons for accessibility (in ToolbarButton component)
- [ ] T106 [P] Add keyboard focus management: trap focus in table when editing, Escape to exit
- [ ] T107 [P] Create loading indicator component in src/components/common/LoadingIndicator.tsx
- [ ] T108 Update EditorProvider to show loading indicator during editor initialization
- [ ] T109 [P] Add browser compatibility check utility in src/utils/browserCheck.ts (warn if unsupported browser)
- [ ] T110 Run quickstart.md validation: start WebSocket server, open editor in two tabs, test all features
- [ ] T111 [P] Add Lighthouse CI configuration for performance monitoring (bundle size, load time)
- [ ] T112 [P] Update global styles in src/index.css (CSS reset, base typography, responsive breakpoints)
- [ ] T113 Update README.md with setup instructions, feature list, technology stack, architecture overview

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **THIS IS MVP**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1 (though builds on same editor foundation)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on US1/US2
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on US1/US2/US3

### Within Each User Story

- Tests (MANDATORY for extensions/collaboration) MUST be written and FAIL before implementation
- Type definitions before implementations
- Extension wrappers can be done in parallel [P]
- Components can be done in parallel [P] if no dependencies
- UI integration after components are ready
- Styles can be done in parallel [P]

### Parallel Opportunities

- **Setup tasks** (T001-T005): Can all run in parallel
- **Foundational tasks** (T006-T014): Most can run in parallel (all marked [P])
- **Once Foundational phase completes**: All user stories (US1, US2, US3, US4) can start in parallel if team capacity allows
- **Within each user story**:
  - All tests marked [P] can run in parallel
  - All extension wrappers marked [P] can run in parallel
  - All components marked [P] can run in parallel
  - All styles marked [P] can run in parallel
- **Polish phase tasks** (T096-T113): Most can run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase complete, launch tests in parallel:
Task T015: Integration test for editor initialization
Task T016: Unit test for Bold extension
Task T017: Unit test for Italic extension
Task T018: Unit test for Heading extension

# Launch type/config files in parallel:
Task T019: EditorConfig.ts
Task T020: editor types.ts

# After T019/T020 complete, implement useEditor Hook:
Task T021: useEditor.ts

# Launch all extension wrappers in parallel:
Task T022: Bold.ts
Task T023: Italic.ts
Task T024: Underline.ts
Task T025: Strike.ts
Task T026: Heading.ts

# Launch all components in parallel:
Task T029: EditorContainer.tsx
Task T030: EditorContent.tsx
Task T031: EditorPlaceholder.tsx
Task T033: ToolbarButton.tsx
Task T034: ToolbarDivider.tsx
Task T036: Button.tsx
Task T037: Tooltip.tsx

# Launch all styles in parallel:
Task T039: EditorContent.module.less
Task T040: Toolbar.module.less
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T014) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T015-T041)
4. **STOP and VALIDATE**: Open editor, type text, apply bold/italic/heading, refresh page - content should persist
5. **Deploy/demo MVP** if ready

**Estimated MVP size**: ~41 tasks (Setup 5 + Foundational 9 + US1 27)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (T001-T014)
2. Add User Story 1 → Test independently → **Deploy/Demo MVP** (T015-T041)
3. Add User Story 2 → Test independently → Deploy/Demo (collaboration enabled) (T042-T062)
4. Add User Story 3 → Test independently → Deploy/Demo (advanced formatting) (T063-T079)
5. Add User Story 4 → Test independently → Deploy/Demo (table support) (T080-T095)
6. Polish → Final optimizations → Deploy/Demo (production ready) (T096-T113)

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T014)
2. **Once Foundational is done, split team**:
   - Developer A: User Story 1 (T015-T041) - **MVP priority**
   - Developer B: User Story 2 (T042-T062) - Can start in parallel
   - Developer C: User Story 3 (T063-T079) - Can start in parallel
   - Developer D: User Story 4 (T080-T095) - Can start in parallel
3. **Stories complete and integrate independently** - each story is self-contained
4. **Team reconvenes for Polish phase** (T096-T113)

---

## Notes

- **[P] tasks**: Different files, no dependencies - safe to run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Tests are MANDATORY** for: TipTap extensions, Yjs collaboration, editor state transitions (per Constitution)
- **Tests are OPTIONAL** for: UI components, simple utilities (not included in this task list to save time, can add if requested)
- **Verify tests fail before implementing** (TDD workflow)
- **Commit after each task or logical group**
- **Stop at any checkpoint to validate story independently** - each user story should work without others
- **Performance targets** to verify at checkpoints:
  - Editor initialization <200ms (empty doc)
  - Format apply <100ms
  - Collaboration sync <1 second
  - Bundle size <150KB gzipped
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence
