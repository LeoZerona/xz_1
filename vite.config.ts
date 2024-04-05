import { defineConfig } from "vite";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import vue from "@vitejs/plugin-vue";
// 配置@别名
import { resolve } from "path";

// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite";
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from "unplugin-vue-components/vite";
//element
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
//ant-design-vue
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  publicPath: process.env.NODE_ENV === "production" ? "/my-app/" : "/",
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
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // 匹配请求路径，
        target: "你要代理的地址", // 代理的目标地址
        // 开发模式，默认的127.0.0.1,开启后代理服务会把origin修改为目标地址
        changeOrigin: true,
        // secure: true, // 是否https接口
        // ws: true, // 是否代理websockets

        // 路径重写，**** 如果你的后端有统一前缀(如:/api)，就不开启；没有就开启
        //简单来说，就是是否改路径 加某些东西
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  }
});
