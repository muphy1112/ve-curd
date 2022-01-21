<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
<template>
    <div style="height: 100%; width: 100%; min-height: 500px">
        <el-card v-if="searchColumns.length > 0" style="margin-bottom: 20px">
            <el-form
                ref="queryFormRef"
                :model="$attrs.model"
                :inline="inline"
                :label-position="labelPosition"
                :label-width="labelWidth"
                :label-suffix="labelSuffix"
                :hide-required-asterisk="hideRequiredAsterisk"
                :show-message="showMessage"
                :inline-message="inlineMessage"
                :status-icon="statusIcon"
                :validate-on-rule-change="validateOnRuleChange"
                :size="size"
                :disabled="formDisabled"
                :validate="validate"
                :validateField="validateField"
                :resetFields="resetFields"
                :scrollToField="scrollToField"
                :clearValidate="clearValidate"
                @validate="formValidate"
            >
                <template #default>
                    <slot name="searchForm">
                        <template
                            v-for="(item, index) in searchColumns"
                            :key="index"
                        >
                            <el-form-item
                                :prop="item.prop"
                                :label="item.label"
                                :label-width="item.labelWidth"
                                :required="item.required"
                                :error="item.error"
                                :show-message="item.showMessage"
                                :inline-message="item.inlineMessage"
                                :size="item.size"
                                :resetField="item.resetField"
                                :clearValidate="item.clearValidate"
                            >
                                <template #default>
                                    <!--    自定义列的内容slot改名为以属性名称命名的slot    -->
                                    <slot :name="item.prop + 'Search'">
                                        <el-date-picker
                                            v-if="item.type === 'daterange'"
                                            clearable
                                            v-model="$attrs.model[item.prop]"
                                            type="daterange"
                                            range-separator="~"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :value-format="
                                                item.valueFormat || 'YYYY-MM-DD'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-date-picker
                                            v-else-if="
                                                item.type === 'datetimerange'
                                            "
                                            clearable
                                            v-model="$attrs.model[item.prop]"
                                            type="datetimerange"
                                            range-separator="~"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            :value-format="
                                                item.valueFormat ||
                                                'YYYY-MM-DD hh:mm:ss'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-checkbox
                                            v-else-if="item.type === 'checkbox'"
                                            clearable
                                            v-model="$attrs.model[item.prop]"
                                            :label="$attrs.model[item.prop]"
                                            style="width: 220px"
                                        ></el-checkbox>
                                        <el-cascader
                                            v-else-if="item.type === 'select'"
                                            clearable
                                            filterable
                                            v-bind="item.dict"
                                            style="width: 220px"
                                            v-model="$attrs.model[item.prop]"
                                        ></el-cascader>
                                        <el-input
                                            v-else
                                            clearable
                                            autosize
                                            placeholder="请输入..."
                                            style="width: 220px"
                                            v-bind="item"
                                            :type="item.type || 'text'"
                                            :show-password="
                                                item.type === 'password'
                                            "
                                            v-model="$attrs.model[item.prop]"
                                        ></el-input>
                                    </slot>
                                </template>
                                <template #label="scope">
                                    <!--    自定义label的内容slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Label'"
                                        :key="scope.key"
                                        :label="scope.label"
                                    >
                                        {{ scope.label }}
                                    </slot>
                                </template>
                                <template #error="scope">
                                    <!--    自定义错误slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Error'"
                                        :error="scope.error"
                                    >
                                        <div class="el-form-item__error">
                                            {{ scope.error }}
                                        </div>
                                    </slot>
                                </template>
                            </el-form-item>
                        </template>
                        <div style="text-align: right">
                            <el-form-item>
                                <slot name="searchButton">
                                    <el-button
                                        type="primary"
                                        @click="handleSearch"
                                    >
                                        查询
                                    </el-button>
                                </slot>
                                <slot name="resetButton">
                                    <el-button
                                        @click="resetForm"
                                        style="margin-left: 30px"
                                    >
                                        重置
                                    </el-button>
                                </slot>
                            </el-form-item>
                        </div>
                    </slot>
                </template>
            </el-form>
        </el-card>
        <el-card>
            <!-- 工具类 -->
            <div style="margin-top: 20px">
                <slot name="addButton">
                    <el-button
                        type="primary"
                        @click="handleAdd"
                    >
                        {{
                            (permission &&
                                permission.add &&
                                permission.add.name) ||
                            "新增"
                        }}
                    </el-button>
                </slot>
                <slot name="toolbar"></slot>
            </div>
            <!-- 表格 -->
            <el-table
                style="width: 100%"
                v-bind="$attrs"
                :data="data"
                @sort-change="handleSortChange"
                @filter-change="handleFilterChange"
            >
                <template #append>
                    <slot name="append"></slot>
                </template>
                <!--       表格列         -->
                <template v-for="(item, index) in tableColumns" :key="index">
                    <el-table-column
                        v-bind="item"
                        v-if="item.hide !== true"
                        :column-key="item.prop"
                    >
                        <template
                            #default="scope"
                            v-if="
                                item.type !== 'selection' &&
                                item.type !== 'index' &&
                                item.type !== 'expand'
                            "
                        >
                            <!--    自定义列的内容slot改名为以属性名称命名的slot    -->
                            <slot
                                :name="item.prop + 'Value'"
                                :row="scope.row"
                                :column="item"
                                :$index="index"
                            >
                                {{ scope.row[item.prop] }}
                            </slot>
                        </template>
                        <template #header="scope">
                            <!--    自定义表头的内容slot改名为以属性名称开头的slot    -->
                            <slot
                                :name="item.prop + 'Header'"
                                :column="item"
                                :$index="index"
                            >
                                {{ scope.column.label }}
                            </slot>
                        </template>
                    </el-table-column>
                </template>
                <!-- 操作 -->
                <el-table-column fixed="right" label="操作" width="160">
                    <template #default="scope">
                        <slot
                            name="viewButton"
                            :row="scope.row"
                            :$index="scope.$index"
                        >
                            <el-button
                                size="small"
                                type="text"
                                @click="handleView(scope.row, scope.$index)"
                            >
                                {{
                                    (permission &&
                                        permission.search &&
                                        permission.search.name) ||
                                    "查看"
                                }}
                            </el-button>
                        </slot>
                        <slot
                            name="editButton"
                            :row="scope.row"
                            :$index="scope.$index"
                        >
                            <el-button
                                size="small"
                                type="text"
                                @click="handleEdit(scope.row, scope.$index)"
                            >
                                {{
                                    (permission &&
                                        permission.edit &&
                                        permission.edit.name) ||
                                    "编辑"
                                }}
                            </el-button>
                        </slot>
                        <slot
                            name="delButton"
                            :row="scope.row"
                            :$index="scope.$index"
                        >
                            <el-button
                                size="small"
                                type="danger"
                                @click="handleDelete(scope.row, scope.$index)"
                            >
                                {{
                                    (permission &&
                                        permission.del &&
                                        permission.del.name) ||
                                    "删除"
                                }}
                            </el-button>
                        </slot>
                        <slot
                            name="operate"
                            :$index="scope.$index"
                            :row="scope.row"
                        ></slot>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                :small="small"
                :background="background"
                :total="total"
                :page-count="pageCount"
                :pager-count="pagerCount"
                :page-sizes="pageSizes"
                :popper-class="popperClass"
                :prev-text="prevText"
                :next-text="nextText"
                :disabled="paginationDisabled"
                :hide-on-single-page="hideOnSinglePage"
                :default-current-page="defaultCurrentPage"
                :layout="layout"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </el-card>

        <!-- 查看 -->
        <el-dialog
            v-model="dialogViewFormVisible"
            :title="viewTitle"
            @open="handleViewOpen"
            @opened="handleViewOpened"
            @close="handleViewClose"
            @closed="handleViewClosed"
        >
            <el-form
                ref="viewFormRef"
                :model="form"
                :inline="inline"
                :label-position="labelPosition"
                :label-width="labelWidth"
                :label-suffix="labelSuffix"
                :status-icon="statusIcon"
                :size="size"
                :disabled="true"
            >
                <template #default>
                    <slot name="editForm" :form="form">
                        <template
                            v-for="(item, index) in viewColumns"
                            :key="index"
                        >
                            <el-form-item
                                v-if="item.viewable !== false"
                                :prop="item.prop"
                                :label="item.label"
                                :label-width="item.labelWidth"
                                :size="item.size"
                            >
                                <template #default>
                                    <!--    自定义列的内容slot改名为以属性名称命名的slot    -->
                                    <slot :name="item.prop + 'View'">
                                        <el-date-picker
                                            v-if="item.type === 'daterange'"
                                            v-model="form[item.prop]"
                                            type="daterange"
                                            range-separator="~"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            disabled
                                            :value-format="
                                                item.valueFormat || 'YYYY-MM-DD'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-date-picker
                                            v-else-if="
                                                item.type === 'datetimerange'
                                            "
                                            disabled
                                            v-model="form[item.prop]"
                                            type="datetimerange"
                                            range-separator="~"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            :value-format="
                                                item.valueFormat ||
                                                'YYYY-MM-DD hh:mm:ss'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-checkbox
                                            v-else-if="item.type === 'checkbox'"
                                            v-model="form[item.prop]"
                                            :label="form[item.prop]"
                                            style="width: 220px"
                                            disabled
                                        ></el-checkbox>
                                        <el-cascader
                                            v-else-if="item.type === 'select'"
                                            v-bind="item.dict"
                                            v-model="form[item.prop]"
                                            style="width: 220px"
                                            disabled
                                        ></el-cascader>
                                        <el-input
                                            v-else
                                            clearable
                                            autosize
                                            placeholder="请输入..."
                                            style="width: 220px"
                                            v-bind="item"
                                            :type="item.type || 'text'"
                                            :show-password="
                                                item.type === 'password'
                                            "
                                            v-model="form[item.prop]"
                                            disabled
                                        ></el-input>
                                    </slot>
                                </template>
                                <template #label="scope">
                                    <!--    自定义label的内容slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Label'"
                                        :key="scope.key"
                                        :label="scope.label"
                                    >
                                        {{ scope.label }}
                                    </slot>
                                </template>
                            </el-form-item>
                        </template>
                    </slot>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogViewFormVisible = false">
                        关闭
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog
            v-model="dialogEditFormVisible"
            :title="editTitle"
            @open="handleEditOpen"
            @opened="handleEditOpened"
            @close="handleEditClose"
            @closed="handleEditClosed"
        >
            <el-form
                ref="editFormRef"
                :model="form"
                :rules="rules"
                :inline="inline"
                :label-position="labelPosition"
                :label-width="labelWidth"
                :label-suffix="labelSuffix"
                :hide-required-asterisk="hideRequiredAsterisk"
                :show-message="showMessage"
                :inline-message="inlineMessage"
                :status-icon="statusIcon"
                :validate-on-rule-change="validateOnRuleChange"
                :size="size"
                :disabled="formDisabled"
                :validate="validate"
                :validateField="validateField"
                :resetFields="resetFields"
                :scrollToField="scrollToField"
                :clearValidate="clearValidate"
                @validate="formValidate"
            >
                <template #default>
                    <slot name="editForm">
                        <template
                            v-for="(item, index) in editColumns"
                            :key="index"
                        >
                            <el-form-item
                                v-if="item.editable"
                                :prop="item.prop"
                                :label="item.label"
                                :label-width="item.labelWidth"
                                :required="item.required"
                                :rules="item.rules"
                                :error="item.error"
                                :show-message="item.showMessage"
                                :inline-message="item.inlineMessage"
                                :size="item.size"
                                :resetField="item.resetField"
                                :clearValidate="item.clearValidate"
                            >
                                <template #default>
                                    <!--    自定义列的内容slot改名为以属性名称命名的slot    -->
                                    <slot :name="item.prop + 'Edit'">
                                        <el-date-picker
                                            v-if="item.type === 'daterange'"
                                            clearable
                                            v-model="form[item.prop]"
                                            type="daterange"
                                            range-separator="~"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :value-format="
                                                item.valueFormat || 'YYYY-MM-DD'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-date-picker
                                            v-else-if="
                                                item.type === 'datetimerange'
                                            "
                                            clearable
                                            v-model="form[item.prop]"
                                            type="datetimerange"
                                            range-separator="~"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            :value-format="
                                                item.valueFormat ||
                                                'YYYY-MM-DD hh:mm:ss'
                                            "
                                        >
                                        </el-date-picker>
                                        <el-checkbox
                                            v-else-if="item.type === 'checkbox'"
                                            clearable
                                            v-model="form[item.prop]"
                                            :label="form[item.prop]"
                                            style="width: 220px"
                                        ></el-checkbox>
                                        <el-cascader
                                            v-else-if="item.type === 'select'"
                                            clearable
                                            filterable
                                            v-bind="item.dict"
                                            style="width: 220px"
                                            v-model="form[item.prop]"
                                        ></el-cascader>
                                        <el-input
                                            v-else
                                            clearable
                                            autosize
                                            placeholder="请输入..."
                                            style="width: 220px"
                                            v-bind="item"
                                            :type="item.type || 'text'"
                                            :show-password="
                                                item.type === 'password'
                                            "
                                            v-model="form[item.prop]"
                                        ></el-input>
                                    </slot>
                                </template>
                                <template #label="scope">
                                    <!--    自定义label的内容slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Label'"
                                        :key="scope.key"
                                        :label="scope.label"
                                    >
                                        {{ scope.label }}
                                    </slot>
                                </template>
                                <template #error="scope">
                                    <!--    自定义错误slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Error'"
                                        :error="scope.error"
                                    >
                                        <div class="el-form-item__error">
                                            {{ scope.error }}
                                        </div>
                                    </slot>
                                </template>
                            </el-form-item>
                        </template>
                    </slot>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleEditSure">
                        确认
                    </el-button>
                    <el-button @click="dialogEditFormVisible = false">
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog
            v-model="dialogAddFormVisible"
            :title="addTitle"
            @open="handleAddOpen"
            @opened="handleAddOpened"
            @close="handleAddClose"
            @closed="handleAddClosed"
        >
            <el-form
                ref="addFormRef"
                :model="form"
                :rules="rules"
                :inline="inline"
                :label-position="labelPosition"
                :label-width="labelWidth"
                :label-suffix="labelSuffix"
                :hide-required-asterisk="hideRequiredAsterisk"
                :show-message="showMessage"
                :inline-message="inlineMessage"
                :status-icon="statusIcon"
                :validate-on-rule-change="validateOnRuleChange"
                :size="size"
                :disabled="formDisabled"
                :validate="validate"
                :validateField="validateField"
                :resetFields="resetFields"
                :scrollToField="scrollToField"
                :clearValidate="clearValidate"
                @validate="formValidate"
            >
                <template #default>
                    <slot name="addForm">
                        <template
                            v-for="(item, index) in addColumns"
                            :key="index"
                        >
                            <el-form-item
                                v-if="item.addable"
                                :prop="item.prop"
                                :label="item.label"
                                :label-width="item.labelWidth"
                                :required="item.required"
                                :rules="item.rules"
                                :error="item.error"
                                :show-message="item.showMessage"
                                :inline-message="item.inlineMessage"
                                :size="item.size"
                                :resetField="item.resetField"
                                :clearValidate="item.clearValidate"
                            >
                                <template #default>
                                    <!--    自定义列的内容slot改名为以属性名称命名的slot    -->
                                    <slot :name="item.prop + 'Add'">
                                        <el-date-picker
                                            v-if="item.type === 'daterange'"
                                            v-model="form[item.prop]"
                                            type="daterange"
                                            range-separator="~"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :value-format="
                                                item.valueFormat || 'YYYY-MM-DD'
                                            "
                                            clearable
                                        >
                                        </el-date-picker>
                                        <el-date-picker
                                            v-else-if="
                                                item.type === 'datetimerange'
                                            "
                                            v-model="form[item.prop]"
                                            type="datetimerange"
                                            range-separator="~"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            :value-format="
                                                item.valueFormat ||
                                                'YYYY-MM-DD hh:mm:ss'
                                            "
                                            clearable
                                        >
                                        </el-date-picker>
                                        <el-checkbox
                                            v-else-if="item.type === 'checkbox'"
                                            v-model="form[item.prop]"
                                            :label="form[item.prop]"
                                            style="width: 220px"
                                            clearable
                                        ></el-checkbox>
                                        <el-cascader
                                            v-else-if="item.type === 'select'"
                                            clearable
                                            filterable
                                            style="width: 220px"
                                            v-bind="item.dict"
                                            v-model="form[item.prop]"
                                        ></el-cascader>
                                        <el-input
                                            v-else
                                            clearable
                                            autosize
                                            placeholder="请输入..."
                                            style="width: 220px"
                                            v-bind="item"
                                            :type="item.type || 'text'"
                                            :show-password="
                                                item.type === 'password'
                                            "
                                            v-model="form[item.prop]"
                                        ></el-input>
                                    </slot>
                                </template>
                                <template #label="scope">
                                    <!--    自定义label的内容slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Label'"
                                        :key="scope.key"
                                        :label="scope.label"
                                    >
                                        {{ scope.label }}
                                    </slot>
                                </template>
                                <template #error="scope">
                                    <!--    自定义错误slot改名为以属性名开头的slot    -->
                                    <slot
                                        :name="item.prop + 'Error'"
                                        :error="scope.error"
                                    >
                                        <div class="el-form-item__error">
                                            {{ scope.error }}
                                        </div>
                                    </slot>
                                </template>
                            </el-form-item>
                        </template>
                    </slot>
                </template>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleAddSure">
                        确认
                    </el-button>
                    <el-button @click="dialogAddFormVisible = false">
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog
            v-model="dialogDeleteVisible"
            :title="deleteTitle"
            width="30%"
        >
            <span>确认删除吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleDeleteSure">
                        确认
                    </el-button>
                    <el-button @click="dialogDeleteVisible = false">
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "ve-curd",
    emits: [
        "update:currentPage",
        "update:pageSize",
        "update:ascs",
        "update:descs",
        "update:filters",
        "searchChange",
        "sizeChange",
        "currentChange",
        "sortChange",
        "filterChange",
        "viewOpen",
        "viewOpened",
        "viewClose",
        "viewClosed",
        "addOpen",
        "addOpened",
        "addClose",
        "addClosed",
        "addSure",
        "editOpen",
        "editOpened",
        "editClose",
        "editClosed",
        "editSure",
        "deleteSure",
    ],
    props: {
        // 表格数据
        data: Array,
        // 编辑表单
        editTitle: {
            type: String,
            default: "编辑",
        },
        // 新增表单
        addTitle: {
            type: String,
            default: "新增",
        },
        // 查看表单
        viewTitle: {
            type: String,
            default: "查看",
        },
        // 查看表单
        deleteTitle: {
            type: String,
            default: "删除",
        },
        // 详情表单
        detailTitle: {
            type: String,
            default: "详情",
        },
        // 查询表单相关
        rules: Object, // el-form的rules
        inline: {
            type: Boolean,
            default: true,
        },
        formDisabled: Boolean,
        labelPosition: String,
        labelWidth: {
            type: [String, Number],
            default: "160px",
        },
        labelSuffix: String,
        hideRequiredAsterisk: Boolean,
        showMessage: {
            type: Boolean,
            default: true,
        },
        inlineMessage: Boolean,
        statusIcon: Boolean,
        validateOnRuleChange: Boolean,
        size: String,
        validate: Function,
        validateField: Function,
        resetFields: Function,
        scrollToField: Function,
        clearValidate: Function,
        // 表属性全部支持el-table的原始属性、方法、事件和插槽  只是将 el改为ve 直接通过 v-bind="$attr" 传给el-table组件
        permission: {
            type: Object,
            default: () => {},
        },
        // 表列属性 在ve-table上通过:columns 绑定 el-table-column的所有支持的属性、方法和插槽等，也新增了一些crud相关的属性
        columns: {
            type: Array,
            default: () => [],
        },
        // 分页 和原始el-pagination属性使用没什么改变，只是全部绑定在ve-table上面
        pageSizes: {
            type: Array,
            default: () => [10, 20, 50, 100, 200, 500],
        },
        hideOnSinglePage: {
            type: Boolean,
            default: true,
        },
        small: Boolean,
        background: Boolean,
        total: Number,
        pageCount: Number,
        pagerCount: Number,
        // pageSize: {
        //     type: Number,
        //     default: 10,
        // },
        // currentPage: {
        //     type: Number,
        //     default: 1,
        // },
        popperClass: String,
        prevText: String,
        nextText: String,
        paginationDisabled: Boolean,
        defaultCurrentPage: {
            type: Number,
            default: 1,
        },
        defaultPageSize: Number,
        layout: {
            type: String,
            default: "total, sizes, prev, pager, next, jumper",
        },
    },
};
</script>

<script setup>
import {
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
    unref,
    watch,
} from "vue";

const { proxy } = getCurrentInstance(); //获取上下文实例，ctx=vue2的this

const queryFormRef = ref();
const addFormRef = ref();
const editFormRef = ref();
const dialogDeleteVisible = ref(false);
const dialogViewFormVisible = ref(false);
const dialogEditFormVisible = ref(false);
const dialogAddFormVisible = ref(false);
const form = ref({});

const handleSizeChange = (val) => {
    // this.$attr.onSizeChange(val) // OK
    proxy.$emit("update:pageSize", val); // OK
    proxy.$emit("sizeChange", val); // OK
};
const handleCurrentChange = (val) => {
    proxy.$emit("update:currentPage", val); // OK
    proxy.$emit("currentChange", val); // OK
};
const formValidate = (prop) => {
    proxy.$emit("validate", prop);
};

const tableColumns = ref(
    proxy.columns.map((column) => {
        let col = {};
        for (const k in column) {
            col[k] = column[k];
        }
        if (
            col.type !== "selection" &&
            col.type !== "index" &&
            col.type !== "expand"
        ) {
            col.rawFilters = !!col.filters;
            col.filterMethod =
                col.filterMethod ||
                function (value, row, column) {
                    const property = column["property"] || column["prop"];
                    return row[property] === value;
                };
        }
        return col;
    })
);

const formColumns = (columns = [], res = []) => {
    return columns.reduce((cols, col) => {
        if (col.children instanceof Array) {
            formColumns(col.children, cols);
        }
        col.showMessage = !!col.showMessage;
        cols.push(col);
        return cols;
    }, res);
};
const searchColumns = reactive(
    formColumns(proxy.columns).filter((col) => col.search === true)
);
const viewColumns = reactive(
    formColumns(proxy.columns).filter((col) => col.viewable === true)
);
const editColumns = reactive(
    formColumns(proxy.columns).filter((col) => col.editable === true)
);
const addColumns = reactive(
    formColumns(proxy.columns).filter((col) => col.addable === true)
);

const handleSearch = async function () {
    const form = unref(queryFormRef);
    if (!form) {
        return;
    }
    try {
        let valid = await form.validate();
        if (valid) {
            searchChange();
        }
    } catch (err) {
        console.log("err", err);
    }
};

const resetForm = function () {
    const form = unref(queryFormRef);
    form.resetFields();
};

const ascs = ref([]);
const descs = ref([]);
const handleSortChange = ({ column, prop, order }) => {
    let idx = ascs.value.indexOf(prop);
    if (idx > -1) {
        ascs.value.splice(idx, 1);
    }
    idx = descs.value.indexOf(prop);
    if (idx > -1) {
        descs.value.splice(idx, 1);
    }
    if ("ascending" === order) {
        ascs.value.push(prop);
    } else if ("descending" === order) {
        descs.value.push(prop);
    }
    proxy.$emit("update:ascs", ascs.value);
    proxy.$emit("update:descs", descs.value);
    proxy.$emit("sortChange", { column, prop, order });
};

const handleFilterChange = (filters) => {
    proxy.$emit("update:filters", filters);
    proxy.$emit("filterChange", filters);
};

const searchChange = () => {
    proxy.$emit("searchChange"); // OK
};

// 查看
const handleView = (row, index) => {
    dialogViewFormVisible.value = true;
    form.value = row;
};
const handleViewOpen = () => {
    proxy.$emit("viewOpen", form.value); // OK
};
const handleViewOpened = () => {
    proxy.$emit("viewOpened", form.value); // OK
};
const handleViewClose = () => {
    proxy.$emit("viewClose", form.value); // OK
};
const handleViewClosed = () => {
    proxy.$emit("viewClosed", form.value); // OK
};

// 编辑
const handleEdit = (row, index) => {
    dialogEditFormVisible.value = true;
    form.value = JSON.parse(JSON.stringify(row));
};
const handleEditSure = async () => {
    const ef = unref(editFormRef);
    if (!ef) {
        return;
    }
    try {
        let valid = await ef.validate();
        if (valid) {
            proxy.$emit("editSure", form.value); // OK
            dialogEditFormVisible.value = false;
        }
    } catch (err) {
        console.log("err", err);
    }
};
const handleEditOpen = () => {
    proxy.$emit("editOpen", form.value); // OK
};
const handleEditOpened = () => {
    proxy.$emit("editOpened", form.value); // OK
};
const handleEditClose = () => {
    proxy.$emit("editClose", form.value); // OK
};
const handleEditClosed = () => {
    proxy.$emit("editClosed", form.value); // OK
};
// 新增
const handleAdd = () => {
    dialogAddFormVisible.value = true;
    form.value = {};
};
const handleAddSure = async () => {
    const ef = unref(addFormRef);
    if (!ef) {
        return;
    }
    try {
        let valid = await ef.validate();
        if (valid) {
            proxy.$emit("addSure", form.value); // OK
            dialogAddFormVisible.value = false;
        }
    } catch (err) {
        console.log("err", err);
    }
};
const handleAddOpen = () => {
    proxy.$emit("addOpen", form.value); // OK
};
const handleAddOpened = () => {
    proxy.$emit("addOpened", form.value); // OK
};
const handleAddClose = () => {
    proxy.$emit("addClose", form.value); // OK
};
const handleAddClosed = () => {
    proxy.$emit("addClosed", form.value); // OK
};
//删除
const handleDelete = (row, index) => {
    dialogDeleteVisible.value = true;
    form.value = row;
};
const handleDeleteSure = () => {
    proxy.$emit("deleteSure", form.value); // OK
    dialogDeleteVisible.value = false;
};

watch(
    () => proxy.data,
    (n) => {
        //直接监听
        let cols = tableColumns.value;
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i];
            col.dict = col.dict || {};
            col.dict.props = col.dict.props || {
                label: "label",
                value: "value",
            };
            if (col.rawFilters) {
                col.filters = col.filters.map((v) => {
                    return {
                        text: v.text || v.label,
                        label: v.label || v.text,
                        value: v.value,
                    };
                });
                col.dict.options = col.dict.options || col.filters;
                continue;
            }
            if (col.type === "select") {
                if (col.dict instanceof Array) {
                    col.dict.forEach((v, i, a) => {
                        if (
                            typeof v === "number" ||
                            typeof v === "string" ||
                            typeof v === "number" ||
                            v instanceof Date
                        ) {
                            a[i] = { text: v, label: v, value: v };
                        }
                    });
                    col.filters = col.dict;
                    col.dict = { options: col.dict };
                } else if (typeof col.dict === "object") {
                    let method = col.dict.method || "get";
                    if (col.dict.options instanceof Array) {
                        col.filters = col.dict.options.map((v) => {
                            return {
                                text: v[col.dict.props.label],
                                label: v[col.dict.props.label],
                                value: v[col.dict.props.value],
                            };
                        });
                        tableColumns.value = cols;
                    } else if (col.dict.url) {
                        proxy.$axios[method](col.dict.url, {}).then((res) => {
                            let data = res.data;
                            if (
                                !(data instanceof Array) &&
                                data.data instanceof Array
                            ) {
                                data = data.data;
                            } else {
                                data = [];
                            }
                            data = data.map((v) => {
                                if (
                                    typeof v === "number" ||
                                    typeof v === "string" ||
                                    typeof v === "number" ||
                                    v instanceof Date
                                ) {
                                    return { text: v, label: v, value: v };
                                }
                                return {
                                    text: v[col.dict.props.label],
                                    label: v[col.dict.props.label],
                                    value: v[col.dict.props.value],
                                };
                            });
                            col.dict.options = data;
                            col.filters = data;
                            tableColumns.value = cols;
                        });
                    }
                }
            } else {
                col.filters = n.reduce(
                    (a, v) => {
                        if (!a.k[v[col.prop]]) {
                            a.k[v[col.prop]] = true;
                            a.a.push({
                                text: v[col.prop],
                                label: v[col.prop],
                                value: v[col.prop],
                            });
                        }
                        return a;
                    },
                    { k: {}, a: [] }
                ).a;
                col.dict.options = col.filters;
            }
        }
        tableColumns.value = cols;
    }
);

onMounted(() => {
    console.log("proxy", proxy);
});
</script>
