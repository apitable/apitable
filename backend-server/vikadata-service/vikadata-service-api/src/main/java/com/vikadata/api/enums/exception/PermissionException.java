package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 权限相关
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/20 17:18
 */
@Getter
@AllArgsConstructor
public enum PermissionException implements BaseException {

    /**
     * 节点不存在
     */
    NODE_NOT_EXIST(600, "节点不存在"),

    /**
     * 无法访问节点
     */
    NODE_ACCESS_DENIED(601, "无法访问节点"),

    /**
     * 无法操作节点
     */
    NODE_OPERATION_DENIED(602, "无法操作节点"),

    /**
     * 设置成员为主管理员失败
     */
    SET_MAIN_ADMIN_FAIL(603, "设置主管理员失败"),

    /**
     * 主管理员权限不能自我转移
     */
    TRANSFER_SELF(603, "主管理员权限不能自我转移"),

    /**
     * 不能选择主管理员作为子管理员
     */
    CAN_OP_MAIN_ADMIN(604, "不能选择主管理员"),

    /**
     * 选择成员不在当前空间
     */
    MEMBER_NOT_IN_SPACE(604, "成员不在当前空间"),

    /**
     * 成员尚未激活
     */
    OP_MEMBER_NOT_ACTIVE_IN_SPACE(604, "成员尚未激活"),

    /**
     * 选择成员已经是子管理员
     */
    OP_MEMBER_IS_SUB_ADMIN(604, "选择成员已经是子管理员"),

    /**
     * 您不是管理员
     */
    NOT_MAIN_ADMIN(605, "您不是管理员"),

    /**
     * 创建子管理员失败
     */
    CREATE_SUB_ADMIN_ERROR(606, "创建子管理员角色失败"),

    /**
     * 更新管理员失败
     */
    UPDATE_ROLE_ERROR(607, "更新管理员失败"),

    /**
     * 删除管理员
     */
    DELETE_ROLE_ERROR(608, "删除管理员失败"),

    /**
     * 管理员不存在
     */
    ROLE_NOT_EXIST(609, "管理员不存在"),

    /**
     * 修改全员可见状态失败
     */
    UPDATE_NODE_VISIBLE(610, "修改全员可见状态失败"),

    /**
     * 你选择的成员或小组已被移除，请重新选择
     */
    ORG_UNIT_NOT_EXIST(611, "你选择的成员或小组已被移除，请重新选择"),

    /**
     * 获取节点角色失败
     */
    LIST_ROLE_ERROR(612, "获取节点角色失败"),

    /**
     * 节点负责人已存在
     */
    NODE_OWNER_ONLY_ONE_ERROR(613, "节点负责人已存在"),

    /**
     * 添加节点角色失败
     */
    ADD_NODE_ROLE_ERROR(613, "添加节点角色失败"),

    /**
     * 节点角色已存在此成员
     */
    NODE_ROLE_HAS_UNIT(614, "节点角色已存在此成员"),

    /**
     * 修改节点角色失败
     */
    UPDATE_NODE_ROLE_ERROR(615, "修改节点角色失败"),

    /**
     * 不能删除主管理员，违法行为
     */
    DELETE_ROOT_NODE_ADMIN_ERROR(616, "不能删除主管理员，违法行为"),

    /**
     * 删除节点角色失败
     */
    DELETE_NODE_ROLE_ERROR(616, "删除节点角色失败"),

    /**
     * 节点角色不存在
     */
    NODE_ROLE_NOT_EXIST(617, "节点角色不存在"),

    /**
     * 继承角色不允许直接删除
     */
    EXTEND_ROLE_DELETE_DENIED(618, "继承角色不允许直接删除"),

    /**
     * 空间管理员不存在
     */
    NODE_ADMINISTRATOR_NOT_EXIST(618, "空间管理员不存在"),

    /**
     * 节点权限已经是指定模式
     */
    NODE_ROLE_HAS_DISABLE_EXTEND(619, "节点权限已经是指定模式"),

    /**
     * 节点权限已经是继承模式
     */
    NODE_ROLE_HAS_ENABLE_EXTEND(619, "节点权限已经是继承模式"),

    /**
     * 首列不允许设置权限
     */
    INDEX_FIELD_NOT_ALLOW_SET(620, "首列不允许设置权限"),

    /**
     * 列权限已开启
     */
    FIELD_PERMISSION_HAS_ENABLE(621, "列权限已开启过，操作失败"),

    /**
     * 列权限未开启
     */
    FIELD_PERMISSION_NOT_OPEN(622, "列权限未开启，操作失败"),

    /**
     * 列权限角色不存在
     */
    FIELD_ROLE_NOT_EXIST(623, "列权限角色不存在"),

    /**
     * 节点权限未开启，操作失败
     */
    NODE_PERMISSION_NOT_OPEN(625, "节点权限未开启，操作失败"),

    /**
     * 更改字段权限配置
     */
    UPDATE_FIELD_ROLE_SETTING(626, "更改字段权限配置"),

    /**
     * 无权限操作列权限变更
     */
    ILLEGAL_CHANGE_FIELD_ROLE(627, "无权限修改列权限"),

    /**
     * 根目录下的节点无法操作
     */
    ROOT_NODE_OP_DENIED(628, "空间站管理员已经限制了在根目录增删文件，所以你无法进行此操作");

    private final Integer code;

    private final String message;
}
