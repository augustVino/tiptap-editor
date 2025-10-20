# Tasks: 编辑器功能增强与主题切换

**Input**: Design documents from `/specs/002-editor-features-theme/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Tests are MANDATORY for this feature (defined in plan.md Phase 1 testing requirements)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root (this project)
- All paths relative to `/Users/liepin/Documents/github/tiptap-editor/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create foundational structure

- [x] T001 Install required TipTap extensions: `pnpm add @tiptap/extension-code@3.7.2 @tiptap/extension-highlight@3.7.2 @tiptap/extension-link@3.7.2 @tiptap/extension-superscript@3.7.2 @tiptap/extension-subscript@3.7.2`
- [x] T002 [P] Create theme directory structure: `src/theme/`
- [x] T003 [P] Create test directory structure: `tests/unit/`, `tests/integration/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Define theme color configuration types in `src/theme/themeConfig.ts` (ThemeName, ThemeColors interfaces)
- [x] T005 [P] Implement light theme colors object in `src/theme/themeConfig.ts`
- [x] T006 [P] Implement dark theme colors object in `src/theme/themeConfig.ts`
- [x] T007 Create ThemeProvider context component in `src/theme/ThemeProvider.tsx` with theme state management
- [x] T008 [P] Create useTheme custom hook in `src/theme/useTheme.ts` for accessing theme context
- [x] T009 [P] Create localStorage utility functions in `src/utils/storage.ts` (getStoredTheme, setStoredTheme, isValidUrl)
- [x] T010 [P] Define CSS variables in `src/theme/themes.less` for all theme colors (--theme-background, --theme-text, etc.)
- [x] T011 Integrate ThemeProvider in `src/App.tsx` to wrap application root

**Checkpoint**: Foundation ready - theme system functional, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 基础文本格式化操作 (Priority: P1) 🎯 MVP

**Goal**: 实现撤销/重做、引用块、代码、高亮、链接、上标、下标、对齐方式等文本格式化功能

**Independent Test**: 每个格式化按钮能够正确地应用和移除格式，工具栏按钮状态正确反映当前格式

### Tests for User Story 1 (MANDATORY)

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Create toolbar actions unit test file `tests/unit/toolbar-actions.test.ts` - test button click handlers and toggle behavior
- [ ] T013 [P] [US1] Create keyboard shortcuts unit test file `tests/unit/keyboard-shortcuts.test.ts` - test Ctrl+Z, Ctrl+Y, Ctrl+K shortcuts
- [ ] T014 [P] [US1] Create editor formatting integration test file `tests/integration/editor-formatting.test.ts` - test end-to-end formatting workflows with TipTap

### Implementation for User Story 1

**TipTap Extensions Configuration**:

- [x] T015 [US1] Configure TipTap extensions in `src/editor/useEditor.ts`: add History (depth: 30), Blockquote, Code, Highlight, Link, Superscript, Subscript, TextAlign extensions

**Toolbar Components**:

- [x] T016 [P] [US1] Create HistoryTools component in `src/components/Toolbar/HistoryTools.tsx` - Undo/Redo buttons with disabled state logic
- [x] T017 [P] [US1] Create FormattingTools component in `src/components/Toolbar/FormattingTools.tsx` - Blockquote, Code, Highlight, Link, Superscript, Subscript buttons
- [x] T018 [P] [US1] Create AlignmentTools component in `src/components/Toolbar/AlignmentTools.tsx` - Text align justify button
- [x] T019 [P] [US1] Add link input handler function in `src/components/Toolbar/FormattingTools.tsx` - prompt-based URL input with validation

**Integration & Styling**:

- [x] T020 [US1] Integrate HistoryTools, FormattingTools, AlignmentTools into `src/components/Toolbar/CollaborativeToolbar.tsx`
- [x] T021 [P] [US1] Add toolbar button styles in `src/components/Toolbar/Toolbar.module.less` - active states, hover effects, disabled states using theme CSS variables

**ARIA Accessibility**:

- [x] T022 [P] [US1] Add ARIA labels and aria-pressed attributes to all formatting buttons for screen reader support

**Checkpoint**: At this point, User Story 1 should be fully functional - all formatting buttons work, tests pass

---

## Phase 4: User Story 2 - 主题切换 (Priority: P1)

**Goal**: 实现亮色/暗色主题切换，主题偏好持久化到 localStorage

**Independent Test**: 点击主题切换按钮能够在两个主题之间切换，所有 UI 元素颜色正确更新，主题偏好在浏览器刷新后保持

### Tests for User Story 2 (MANDATORY)

- [ ] T023 [P] [US2] Create theme manager unit test file `tests/unit/theme-manager.test.ts` - test theme toggle logic, localStorage persistence, CSS variable application

### Implementation for User Story 2

**Theme Toggle Component**:

- [x] T024 [P] [US2] Create ThemeToggle component in `src/components/Toolbar/ThemeToggle.tsx` - button with moon/sun icon, onClick handler calling toggleTheme()
- [x] T025 [P] [US2] Add ThemeToggle styles in `src/components/Toolbar/ThemeToggle.module.less` - right-aligned button with smooth icon transition

**Integration**:

- [x] T026 [US2] Integrate ThemeToggle into `src/components/Toolbar/CollaborativeToolbar.tsx` - position at far right with visual separation
- [x] T027 [P] [US2] Add theme transition CSS in `src/theme/themes.less` - smooth color transitions (<200ms) for all themed elements

**Theme Application to Existing Components**:

- [x] T028 [US2] Update editor content area styles to use theme CSS variables in relevant component Less files
- [x] T029 [P] [US2] Update sidebar styles to use theme CSS variables in `src/components/Sidebar/CollaboratorList.module.less`
- [x] T030 [P] [US2] Ensure all existing toolbar buttons inherit theme colors from CSS variables

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - formatting works, theme switching works, all tests pass

---

## Phase 5: User Story 3 - 键盘快捷键支持 (Priority: P2)

**Goal**: 为格式化操作添加键盘快捷键支持，提高重度用户效率

**Independent Test**: Ctrl+Z/Ctrl+Y 执行撤销/重做，Ctrl+K 打开链接输入，工具栏按钮显示对应视觉反馈

### Implementation for User Story 3

**Keyboard Shortcuts Configuration**:

- [x] T031 [US3] Configure keyboard shortcuts in `src/editor/useEditor.ts` or create `src/editor/keyboardShortcuts.ts` - map Ctrl+K to link dialog (History shortcuts already handled by TipTap)

**Visual Feedback**:

- [x] T032 [P] [US3] Add keyboard shortcut visual feedback logic in toolbar components - highlight button when shortcut is pressed
- [x] T033 [P] [US3] Add tooltip hints to toolbar buttons showing keyboard shortcuts (e.g., "Undo (Ctrl+Z)")

**Checkpoint**: All user stories should now be independently functional - formatting, theme switching, keyboard shortcuts all work

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, final validation

- [x] T034 [P] Performance optimization: Add `useMemo` to theme config objects in `src/theme/ThemeProvider.tsx` (already implemented)
- [x] T035 [P] Performance optimization: Add debounce to theme toggle in `src/components/Toolbar/ThemeToggle.tsx` to prevent rapid clicking
- [x] T036 [P] Add loading states and error handling for localStorage failures in `src/utils/storage.ts` (already implemented with try-catch)
- [x] T037 Code cleanup: Remove any console.log statements, ensure all functions have TypeScript return types
- [ ] T038 Accessibility audit: Verify all toolbar buttons are keyboard navigable (Tab navigation), verify focus indicators (MANUAL TESTING REQUIRED)
- [x] T039 [P] Documentation: Update README.md with new toolbar features and theme switching instructions
- [x] T040 [P] Run `pnpm type-check` to verify all TypeScript strict mode compliance
- [x] T041 [P] Run `pnpm build` to verify bundle size target (+15KB gzipped max)
- [ ] T042 Run all tests: `pnpm vitest run` - verify 100% test pass rate
- [ ] T043 Manual testing: Validate quickstart.md scenarios in Chrome, Safari, Firefox (latest 2 versions)
- [ ] T044 Performance testing: Measure theme switch time (<300ms requirement), verify editor initialization time unchanged

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P1): Can start after Foundational - Independent of US1 (but uses theme system from Foundational)
  - User Story 3 (P2): Can start after Foundational - Builds on US1 toolbar buttons (should wait for US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Completely independent
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses theme system but independent from US1
- **User Story 3 (P2)**: Should wait for US1 completion (references toolbar buttons from US1)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- TipTap extensions configuration before toolbar components
- Toolbar components before integration into CollaborativeToolbar
- Styling after component structure
- ARIA attributes after component logic

### Parallel Opportunities

**Setup Phase**:
- T002 and T003 can run in parallel (different directories)

**Foundational Phase**:
- T004, T005, T006 can run in parallel (different theme configs)
- T008, T009, T010 can run in parallel (different files)

**User Story 1**:
- T012, T013, T014 (all tests) can run in parallel
- T016, T017, T018 (toolbar components) can run in parallel
- T021, T022 (styling and ARIA) can run in parallel

**User Story 2**:
- T024, T025 (component and styles) can run in parallel
- T028, T029, T030 (theme application to existing components) can run in parallel

**User Story 3**:
- T032, T033 (visual feedback and tooltips) can run in parallel

**Polish Phase**:
- T034, T035, T036, T037, T039, T040, T041 (most polish tasks) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (BEFORE implementation):
Task: "Create toolbar actions unit test in tests/unit/toolbar-actions.test.ts"
Task: "Create keyboard shortcuts unit test in tests/unit/keyboard-shortcuts.test.ts"
Task: "Create editor formatting integration test in tests/integration/editor-formatting.test.ts"

# After tests written and failing, launch all toolbar components together:
Task: "Create HistoryTools component in src/components/Toolbar/HistoryTools.tsx"
Task: "Create FormattingTools component in src/components/Toolbar/FormattingTools.tsx"
Task: "Create AlignmentTools component in src/components/Toolbar/AlignmentTools.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

This feature has TWO P1 user stories that together form the MVP:

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (theme system) - CRITICAL
3. Complete Phase 3: User Story 1 (formatting buttons) - Core editing features
4. Complete Phase 4: User Story 2 (theme switching) - Enhanced UX
5. **STOP and VALIDATE**: Test US1 & US2 independently, verify all tests pass
6. Deploy/demo if ready (Phase 5 US3 keyboard shortcuts can be added later)

### Incremental Delivery

1. **Foundation** (Phase 1-2): Install deps + theme system → Theme infrastructure ready
2. **MVP v1** (Phase 3): Add User Story 1 → Test independently → Formatting buttons work
3. **MVP v2** (Phase 4): Add User Story 2 → Test independently → Theme switching works → **DEPLOY MVP**
4. **Enhancement** (Phase 5): Add User Story 3 → Test independently → Keyboard shortcuts work → Deploy v1.1
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (critical path)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (formatting buttons)
   - **Developer B**: User Story 2 (theme toggle)
3. After US1 & US2 complete:
   - **Developer C**: User Story 3 (keyboard shortcuts) - depends on US1
4. Stories complete and integrate independently

### Recommended Execution

**Week 1**:
- Day 1: Phase 1 Setup + start Phase 2 Foundational
- Day 2-3: Complete Phase 2 Foundational (theme system)
- Day 4-5: Phase 3 User Story 1 (tests first, then implementation)

**Week 2**:
- Day 1-2: Phase 4 User Story 2 (theme toggle)
- Day 3: Phase 5 User Story 3 (keyboard shortcuts)
- Day 4-5: Phase 6 Polish + testing

---

## Task Summary

**Total Tasks**: 44

**Task Count by Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (US1 - Formatting): 11 tasks
- Phase 4 (US2 - Theme): 8 tasks
- Phase 5 (US3 - Shortcuts): 3 tasks
- Phase 6 (Polish): 11 tasks

**Task Count by User Story**:
- User Story 1: 11 tasks (including 3 tests)
- User Story 2: 8 tasks (including 1 test)
- User Story 3: 3 tasks
- Foundational: 8 tasks
- Setup/Polish: 14 tasks

**Parallel Opportunities Identified**: 23 tasks marked [P] (52% parallelizable)

**Test Tasks**: 4 mandatory test files (T012-T014 for US1, T023 for US2)

**Independent Test Criteria**:
- **US1**: Each formatting button applies/removes format correctly, tests pass
- **US2**: Theme toggles between light/dark, localStorage persists choice, all UI colors update
- **US3**: Keyboard shortcuts trigger same actions as toolbar buttons, visual feedback shown

**Suggested MVP Scope**: User Stories 1 & 2 (formatting buttons + theme switching) = Tasks T001-T030

**Format Validation**: ✅ All tasks follow checklist format (checkbox + ID + [P]/[Story] labels + file paths)
