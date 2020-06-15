//webpack 服务端、客户端插件
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

// 优化相关
const nodeExternals = require('webpack-node-externals')
// 合并相关
const merge = require('lodash.merge')

// 环境变量：决定入口是客户端还是服务端
const TARGET_NODE = process.env.WEBPACK_TARGET === "node"
const target = TARGET_NODE? "server": "client"

module.exports = {

    css: {
        extract: false
    },

    // 根据服务器或者客户端，编译到不同文件夹
    outputDir: './dist/'+target,

    configureWebpack: ()=>({
        // 将entry指向应用程序的 server/client 文件
        entry: `./src/entry-${target}.js`,
        // 对 bundle renderer 提供 source map支持
        devtool: 'source-map',
        // 这运行 webpack 以 Node 适用方式处理动态导入（dynamic import）
        // 并且还会在编译 Vue 组件时告知 'vue-loader' 输出面向服务器代码（server-oriented code）
        target: TARGET_NODE? 'node' : 'web',
        node: TARGET_NODE? undefined : false,
        output: {
            // 此处告知 server bundle 使用Node风格导出模块
            libraryTarget: TARGET_NODE ? "commonjs2" : undefined
        },
        //外置化应用程序依赖模块。可以使服务器构建速度更快，并生成较小的bundle文件
        externals: TARGET_NODE
            ? nodeExternals({
                // 不要外置化webpack  需要处理的依赖模块
                // 可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件
                // 你还应该将修改 `global` （例如 polyfill）的依赖模块列入白名单
                whitelist: [/\.css$/]
            })
            : undefined,
        optimization: {
            splitChunks: TARGET_NODE ? false : undefined 
        },
        // 这是将服务器的整个输出构建为单个JSON文件的插件
        // 服务端默认文件名为 `vue-ssr-server-bundle.json`
        plugins: [TARGET_NODE? new VueSSRServerPlugin(): new VueSSRClientPlugin()]
    }),

    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                merge(options, {
                    optimizeSSR: false
                })
            })
    }
}