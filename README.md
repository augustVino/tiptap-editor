# TipTap 富文本编辑器 Demo

这是一个基于 React + Vite + TipTap 的富文本编辑器演示项目。

## 功能特性

- ✨ 基于 TipTap 的现代富文本编辑器
- 🎨 美观的用户界面设计
- 🌙 支持明暗主题切换
- 📱 响应式设计
- 🔗 提及（Mention）功能支持

## 技术栈

- **React 18** - 前端框架
- **Vite** - 构建工具
- **TipTap** - 富文本编辑器核心
- **CSS3** - 样式设计

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:3000` 启动。

### 构建项目

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 项目结构

```
tiptap-editor/
├── src/
│   ├── components/
│   │   ├── TiptapEditor.jsx    # TipTap编辑器组件
│   │   └── TiptapEditor.css    # 编辑器样式
│   ├── App.jsx                 # 主应用组件
│   ├── App.css                 # 应用样式
│   ├── main.jsx                # 应用入口
│   └── index.css               # 全局样式
├── index.html                  # HTML模板
├── vite.config.js              # Vite配置
└── package.json                # 项目配置
```

## TipTap 扩展

当前项目包含以下 TipTap 扩展：

- `Document` - 文档结构
- `Paragraph` - 段落
- `Text` - 文本
- `Mention` - 提及功能

## 自定义开发

您可以根据需要添加更多 TipTap 扩展，例如：

- Bold/Italic - 粗体/斜体
- Link - 链接
- Image - 图片
- Table - 表格
- Code Block - 代码块

更多扩展请参考 [TipTap 官方文档](https://tiptap.dev/)。

## 许可证

ISC
