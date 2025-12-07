import { defineConfig } from "vite";
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vue from "@vitejs/plugin-vue";
// 配置@别名
import { resolve } from "path"; 


// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite";
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from "unplugin-vue-components/vite";
//element
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//ant-design-vue
import {AntDesignVueResolver} from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/
export default defineConfig({
  // 配置 base 路径，如果是 GitHub Pages，使用仓库名作为 base
  // 例如：如果仓库名是 xz_1，则 base: '/xz_1/'
  // 如果是自定义域名，则 base: '/'
  // 开发环境始终使用 '/'，生产环境使用环境变量或默认 '/'
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.VITE_BASE_PATH || '/') 
    : '/',
  plugins: [
    vue(),
		VueSetupExtend(),
    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ["vue", "vue-router"],
      //存放的位置
      dts: "src/auto-import.d.ts",
      resolvers: [ElementPlusResolver()], //element
      // resolvers: [AntDesignVueResolver()] //ant-design-vue
    }),
    Components({
			//element
			resolvers: [ElementPlusResolver()],
			// //ant-design-vue   importStyle = false 样式就没了
			// resolvers: [AntDesignVueResolver({importStyle: true, resolveIcons: true})],
      // 引入组件的,包括自定义组件
      // 存放的位置
      dts: "src/components.d.ts",
    }),
  ],
	resolve:{
		alias: {
			"@": resolve(__dirname, "./src")
		}
	},
  server: {
    // 优化 HMR 连接，减少动态导入失败的问题
    hmr: {
      overlay: true,
    },
    // 增加文件系统监听选项
    watch: {
      usePolling: false,
      interval: 100,
    },
    proxy: {
      "/api": {
        // 匹配请求路径
        // TODO: 请配置实际的后端服务地址
        target: "http://localhost:3000", // 代理的目标地址
        // 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
        changeOrigin: true,
        // secure: true, // 是否https接口
        // ws: true, // 是否代理websockets

        // 路径重写，如果你的后端有统一前缀(如:/api)，就不开启；没有就开启
        // 简单来说，就是是否改路径 加某些东西
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // 优化构建配置，减少动态导入问题
  optimizeDeps: {
    include: ['vue', 'vue-router'],
    exclude: [],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 生产环境移除 console
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
