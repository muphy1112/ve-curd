<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
import request from 'axios'

export function getPage(query) {
    return Promise.resolve({ data: { success: true, data: { total: 58, records: [{"admin":true,"id":"1","lastTime":1642735776019,"password":"123456","realName":"超级管理员","roleIds":"1","status":"1","username":"admin"},{"admin":false,"id":"11","lastTime":1642735776019,"password":"440","realName":"jjj","roleIds":"2","status":"0","username":"qqq"},{"admin":false,"id":"12","lastTime":1642735776019,"roleIds":"","status":"0"},{"admin":false,"id":"13","lastTime":1642735776019,"password":"111111","realName":"宝宝","roleIds":"2","status":"0","username":"aaa"},{"admin":false,"id":"14","lastTime":1642735776019,"roleIds":"","status":"0"},{"admin":false,"id":"2","lastTime":1642735776019,"password":"123456","realName":"管理员","roleIds":"2","status":"1","username":"test"},{"admin":false,"id":"3","lastTime":1642735776019,"roleIds":"","status":"0"},{"admin":false,"id":"4","lastTime":1642735776019,"roleIds":"","status":"0"},{"admin":false,"id":"5","lastTime":1642735776019,"roleIds":"","status":"0"},{"admin":false,"id":"6","lastTime":1642735776019,"roleIds":"","status":"0"}]}}});
    // return request({
    //     url: '/gw/user/page',
    //     method: 'get',
    //     params: query
    // })
}

export function getList(query) {
    return request({
        url: '/gw/user/list',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/gw/user',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/gw/user/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/gw/user/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/gw/user',
        method: 'put',
        data: obj
    })
}
