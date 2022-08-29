package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * TemplateException
 * 模板异常状态码
 * 状态码范围（430-439）
 *
 * @author Chambers
 * @since 2020/5/18
 */
@Getter
@AllArgsConstructor
public enum TemplateException implements BaseException {

    /**
     * 模板数量已到达上限
     */
    NUMBER_LIMIT(430, "模板数量已到达上限"),

    /**
     * 当前表有关联的列，无法保存为模板
     */
    LINK_FOREIGN_NODE(430, "当前表有关联的列，无法保存为模板"),

    /**
     * 文件夹下存在权限不足的节点，创建失败
     */
    SUB_NODE_PERMISSION_INSUFFICIENT(430, "文件夹下存在权限不足的节点，创建失败"),

    /**
     * 存在字段权限不足的维格表，创建失败
     */
    FIELD_PERMISSION_INSUFFICIENT(430, "存在字段权限不足的维格表，创建失败"),

    /**
     * 收集表不允许单独保存模板
     */
    SINGLE_FORM_CREATE_FAIL(430, "收集表不允许单独保存模板"),

    /**
     * 收集表关联了外部的表格，创建失败
     */
    FORM_LINK_FOREIGN_NODE(430, "收集表关联了外部的表格，创建失败"),

    /**
     * 仪表盘不允许单独保存模板
     */
    SINGLE_DASHBOARD_CREATE_FAIL(430, "仪表盘不允许单独保存模板"),

    /**
     * 仪表盘的组件引用了外部的表格，创建失败
     */
    DASHBOARD_LINK_FOREIGN_NODE(430, "仪表盘的组件引用了外部的表格，创建失败"),

    /**
     * 镜像不允许单独保存模板
     */
    SINGLE_MIRROR_CREATE_FAIL(430, "镜像不允许单独保存模板"),

    /**
     * 镜像关联了文件夹以外的表格，创建模板失败
     */
    MIRROR_LINK_FOREIGN_NODE(430, "镜像关联了文件夹以外的表格，创建模板失败"),

    /**
     * 当前文件夹里的「${NODE_NAME}」表中的${FOREIGN_FIELD_NAMES}列关联了文件夹外的表。文件夹内有关联了文件夹外的情况将无法保存为模版
     */
    FOLDER_NODE_LINK_FOREIGN_NODE(430, "当前文件夹里的「${NODE_NAME}」表中的${FOREIGN_FIELD_NAMES}列关联了文件夹外的表。文件夹内有关联了文件夹外的情况将无法保存为模版"),

    /**
     * 当前文件夹里的「${NODE_NAME}」表单所连接的表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版
     */
    FOLDER_FORM_LINK_FOREIGN_NODE(430, "当前文件夹里的「${NODE_NAME}」表单所连接的表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版"),

    /**
     * 当前文件夹里的「${NODE_NAME}」仪表盘中的「${FOREIGN_WIDGET_NAME}」小程序引用的表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版
     */
    FOLDER_DASHBOARD_LINK_FOREIGN_NODE(430, "当前文件夹里的「${NODE_NAME}」仪表盘中的「${FOREIGN_WIDGET_NAME}」小程序引用的表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版"),

    /**
     * 当前文件夹里的「${NODE_NAME}」镜像所连接的原表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版
     */
    FOLDER_MIRROR_LINK_FOREIGN_NODE(430, "当前文件夹里的「${NODE_NAME}」镜像所连接的原表不在当前文件夹内。文件夹内有关联了文件夹外的情况将无法保存为模版"),

    /**
     * 当前表中的${FOREIGN_FIELD_NAMES}列关联了其他表。该情况将无法保存为模版
     */
    NODE_LINK_FOREIGN_NODE(430, "当前表中的${FOREIGN_FIELD_NAMES}列关联了其他表。该情况将无法保存为模版"),

    /**
     * 模板信息错误
     */
    TEMPLATE_INFO_ERROR(431, "模板信息错误"),

    /**
     * 模板内容无法修改
     */
    TEMPLATE_CONTENT_CANNOT_MODIFY(432, "模板内容无法修改");


    private final Integer code;

    private final String message;
}
