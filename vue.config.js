module.exports = {
    // 修改 src 目录 为 examples 目录
    pages: {
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    devServer: {
        proxy: {
            "/gw": {
                target: "http://192.168.2.17:8088/",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    "^/gw": "/",
                },
            },
        },
    },
}