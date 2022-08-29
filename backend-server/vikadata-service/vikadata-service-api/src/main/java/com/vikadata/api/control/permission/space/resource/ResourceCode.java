package com.vikadata.api.control.permission.space.resource;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 资源权限常量
 * </p>
 *
 * @author Pengap
 * @date 2021/10/25 10:53:05
 */
@Getter
@AllArgsConstructor
public enum ResourceCode {

    UPDATE_SPACE("UPDATE_SPACE", "更新空间"),

    DELETE_SPACE("DELETE_SPACE", "删除空间"),

    MANAGE_WORKBENCH_SETTING("MANAGE_WORKBENCH_SETTING", "管理配置"),

    ADD_MEMBER("ADD_MEMBER", "添加成员"),

    INVITE_MEMBER("INVITE_MEMBER", "邀请成员"),

    READ_MEMBER("READ_MEMBER", "读取成员"),

    UPDATE_MEMBER("UPDATE_MEMBER", "更新成员"),

    DELETE_MEMBER("DELETE_MEMBER", "删除成员"),

    CREATE_TEAM("CREATE_TEAM", "添加部门"),

    READ_TEAM("READ_TEAM", "读取部门"),

    UPDATE_TEAM("UPDATE_TEAM", "更新部门"),

    DELETE_TEAM("DELETE_TEAM", "删除部门"),

    READ_MAIN_ADMIN("READ_MAIN_ADMIN", "读取主管理员"),

    UPDATE_MAIN_ADMIN("UPDATE_MAIN_ADMIN", "更新主管理员"),

    CREATE_SUB_ADMIN("CREATE_SUB_ADMIN", "添加子管理员"),

    READ_SUB_ADMIN("READ_SUB_ADMIN", "读取子管理员"),

    UPDATE_SUB_ADMIN("UPDATE_SUB_ADMIN", "更新子管理员"),

    DELETE_SUB_ADMIN("DELETE_SUB_ADMIN", "删除子管理员"),

    MANAGE_MEMBER_SETTING("MANAGE_MEMBER_SETTING", "管理配置"),

    CREATE_TEMPLATE("CREATE_TEMPLATE", "创建模板"),

    DELETE_TEMPLATE("DELETE_TEMPLATE", "删除模板"),

    MANAGE_SHARE_SETTING("MANAGE_SHARE_SETTING", "管理分享与邀请设置"),

    MANAGE_FILE_SETTING("MANAGE_FILE_SETTING", "管理文件权限"),

    MANAGE_ADVANCE_SETTING("MANAGE_ADVANCE_SETTING", "管理企业安全中心"),

    MANAGE_INTEGRATION_SETTING("MANAGE_INTEGRATION_SETTING", "管理第三方应用集成"),

    UNPUBLISH_WIDGET("UNPUBLISH_WIDGET", "下架小组件"),

    TRANSFER_WIDGET("TRANSFER_WIDGET", "移交小组件");

    private final String code;

    private final String name;

}
