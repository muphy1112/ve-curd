<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
<template>
    <div style="width: 100%; height: 800px">
        <!-- 列表 -->
        <ve-curd
            :model="form"
            show-message
            :data="tableData"
            :columns="tableColumns"
            :total="page.total"
            v-model:page-size="page.pageSize"
            v-model:current-page="page.currentPage"
            v-model:ascs="page.ascs"
            v-model:descs="page.descs"
            v-model:filters="page.filters"
            @sort-change="handleChange"
            @size-change="handleChange"
            @current-change="handleChange"
            @filter-change="searchChange"
            @search-change="searchChange"
            @delete-sure="handleDelete"
            @edit-sure="handleEdit"
            @add-sure="handleAdd"
        >
        </ve-curd>
    </div>
</template>
<script>
export default {
    name: "HelloWorld",
    data: () => ({
        description: "用户信息查询与设置",
        menus: {
            search: { name: "查询" },
            add: { name: "添加" },
            edit: { name: "编辑" },
            del: { name: "删除" },
        },
    }),
};
</script>

<script setup>

import * as azi from "../api/user";

import { getCurrentInstance, reactive, ref, unref, onMounted } from "vue";
const { proxy } = getCurrentInstance(); //获取上下文实例，ctx=vue2的this

const form = reactive({
    name: "",
});
const page = reactive({
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: 10, // 每页显示多少条
    ascs: [], //升序字段
    descs: [], //降序字段
    filters: [], //降序字段
});
const tableData = ref([]);

const tableColumns = ref([
    {
        type: "selection",
    },
    {
        label: "ID",
        prop: "id",
        search: true,
        sortable: "custom",
        addable: true,
        editable: true,
        viewable: true,
        filters: [
            { text: "第一个", value: "1" },
            { text: "第二个", value: "2" },
            { text: "第三个", value: "3" },
            { text: "第四个", value: "4" },
        ],
        filterMethod: (value, row, column) => {
            const property = column["property"];
            return row[property] === value;
        },
        rules: [
            {
                required: true,
                message: "请输入ID",
                trigger: "blur",
            },
            {
                max: 32,
                message: "长度在不能超过32个字符",
            },
        ],
    },
    {
        label: "用户账号",
        prop: "username",
        hide: true,
        search: true,
        sortable: true,
        addable: true,
        editable: true,
        viewable: true,
        type: "url",
        rules: [
            {
                max: 32,
                message: "长度在不能超过32个字符",
            },
        ],
    },
    {
        label: "用户名称",
        prop: "realName",
        sortable: true,
        search: true,
        addable: true,
        editable: true,
        viewable: true,
        maxlength: 55,
        type: "textarea",
        rules: [
            {
                max: 32,
                message: "长度在不能超过32个字符",
            },
        ],
    },
    {
        label: "用户密码",
        prop: "password",
        type: "password",
        hide: true,
        search: true,
        sortable: true,
        addable: true,
        editable: true,
        viewable: true,
        rules: [
            {
                max: 32,
                message: "长度在不能超过32个字符",
            },
        ],
        resetField: (e) => {
            alert("dd" + e);
        },
    },
    {
        label: "角色ID",
        prop: "roleIds",
        search: true,
        sortable: true,
        addable: true,
        editable: true,
        viewable: true,
        type: "number",
        rules: [
            {
                max: 32,
                message: "长度在不能超过32个字符",
            },
        ],
    },
    {
        label: "状态：0-禁用，1-启用",
        prop: "status",
        search: true,
        sortable: true,
        addable: true,
        editable: true,
        viewable: true,
        type: "select",
        dict: {
            options: [
                { text: "禁用", label: "禁用", value: "0" },
                { text: "启用", label: "启用", value: "1" },
            ],
        },
    },
]);

const handleDelete = (row) => {
    console.log("handleDelete", row);
    azi.delObj(row).then((res) => {
        if (res.success) {
            searchChange();
        } else {
            throw new Error(res.msg);
        }
    });
};

const handleEdit = (row) => {
    console.log("handleEdit", row);
    azi.putObj(row).then((res) => {
        if (res.success) {
            searchChange();
        } else {
            throw new Error(res.msg);
        }
    });
};

const handleAdd = (row) => {
    console.log("handleAdd", row);
    azi.addObj(row).then((res) => {
        if (res.success) {
            searchChange();
        } else {
            throw new Error(res.msg);
        }
    });
};

const searchChange = () => {
    let p = unref(page);
    p.total = 0;
    return handleChange();
};

const handleChange = () => {
    let p = unref(page);
    let params = Object.assign({}, p, form);
    console.log("handleChange", params);
    return azi.getPage(params).then((d) => {
        if (d.data.success) {
            p.total = d.data.data.total;
            tableData.value = d.data.data.records || [];
        }
    });
};

handleChange();

onMounted(() => {
    console.log(proxy, proxy);
})
</script>

<style lang="scss" scoped></style>
