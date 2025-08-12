import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
          // 可以在这里定义全局Less变量
          '@primary-color': '#1890ff'
        }
      }
    }
  }
});
