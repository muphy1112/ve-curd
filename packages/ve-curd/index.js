<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
import VeCurd from './src/VeCurd'

VeCurd.install = function (Vue) {
    Vue.component(VeCurd.name, VeCurd)
}

// 默认导出组件
export default VeCurd