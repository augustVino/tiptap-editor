import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // SVG 作为 React 组件导入
      svgrOptions: {
        icon: true, // 移除 width/height，使用 fontSize
        dimensions: false
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  css: {
    modules: {
      // CSS Modules 配置
      localsConvention: 'camelCase', // 支持驼峰命名
      generateScopedName: '[name]__[local]___[hash:base64:5]' // 生成的类名格式
    },
    preprocessorOptions: {
      less: {
        // Less 配置
        javascriptEnabled: true,
        modifyVars: {
          // Ant Design 主题变量
          '@primary-color': 'rgb(98, 41, 255)', // 使用项目的紫色主题
          '@border-radius-base': '4px',
          '@font-family':
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }
    }
  },
  build: {
    // 优化打包配置
    rollupOptions: {
      output: {
        // 分包策略：将 antd 单独打包，利用浏览器缓存
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'tiptap-vendor': ['@tiptap/react', '@tiptap/core', '@tiptap/starter-kit'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'yjs-vendor': ['yjs', 'y-websocket', 'y-indexeddb', 'y-protocols']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境移除 console
        drop_console: true,
        drop_debugger: true
      }
    },
    // 打包分析
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000 // 将警告阈值提高到 1000KB
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', '@ant-design/icons', '@tiptap/react', 'yjs']
  }
});
