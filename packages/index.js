<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
import VeCurd from './ve-curd'

// 存储组件列表
const components = [
    VeCurd
]

// 定义 install 方法，接收 app 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (app) {
    // 判断是否安装
    if (install.installed) {
        return
    }
    // 遍历注册全局组件
    components.map(component => app.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    // 导出的对象必须具有 install，才能被 app.use() 方法安装
    install,
    // 以下是具体的组件列表
    ...components
}