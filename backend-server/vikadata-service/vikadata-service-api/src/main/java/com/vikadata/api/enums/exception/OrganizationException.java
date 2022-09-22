package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * OrganizationException
 * 组织相关异常状态码
 * 状态码范围（501-599）
 *
 * @author Chambers
 * @since 2019/10/29
 */
@Getter
@AllArgsConstructor
public enum OrganizationException implements BaseException {

    /**
     * 创建部门失败
     */
    CREATE_TEAM_ERROR(501, "创建部门失败"),

    /**
     * 修改部门失败
     */
    UPDATE_TEAM_ERROR(502, "修改部门失败"),

    /**
     * 修改部门名称失败
     */
    UPDATE_TEAM_NAME_ERROR(502, "修改部门名称失败"),

    /**
     * 调整部门层级失败,不能调整到自己的子部门下面
     */
    UPDATE_TEAM_LEVEL_ERROR(502, "调整部门层级失败,不能调整到自己的子部门下面"),

    /**
     * 删除部门失败
     */
    DELETE_TEAM_ERROR(503, "删除部门失败"),

    /**
     * 需要先删除部门下的成员，再删除该部门
     */
    TEAM_HAS_SUB(504, "该部门下存在子部门，需要先删除部门下的子部门"),

    /**
     * 需要先删除部门下的成员，再删除该部门
     */
    TEAM_HAS_MEMBER(505, "需要先删除部门下的成员，再删除该部门"),

    /**
     * 部门不存在
     */
    GET_TEAM_ERROR(506, "部门不存在，请重试"),

    /**
     * 不允许删除根部门
     */
    DELETE_ROOT_ERROR(507, "不允许删除根部门"),

    /**
     * 成员不存在
     */
    NOT_EXIST_MEMBER(508, "抱歉，成员不存在"),

    /**
     * 编辑成员失败
     */
    UPDATE_MEMBER_ERROR(509, "编辑成员失败"),

    /**
     * 添加成员失败
     */
    CREATE_MEMBER_ERROR(510, "添加成员失败"),

    /**
     * 调整成员所属部门失败
     */
    UPDATE_MEMBER_TEAM_ERROR(511, "调整成员所属部门失败"),

    /**
     * 不允许删除主管理员
     */
    DELETE_SPACE_ADMIN_ERROR(512, "不允许删除主管理员"),

    /**
     * 删除操作类型错误
     */
    DELETE_ACTION_ERROR(512, "删除操作类型错误"),

    /**
     * 删除成员参数错误
     */
    DELETE_MEMBER_PARAM_ERROR(512, "删除成员参数错误"),

    /**
     * 删除成员失败
     */
    DELETE_MEMBER_ERROR(512, "删除成员失败"),

    /**
     * 新建标签失败
     */
    CREATE_TAG_ERROR(514, "新建标签失败"),

    /**
     * 修改标签失败
     */
    RENAME_TAG_ERROR(515, "修改标签失败"),

    /**
     * 调整成员部门失败
     */
    UPDATE_MEMBER_TAG_ERROR(516, "更新成员所属标签失败"),

    /**
     * 邀请成员失败
     */
    INVITE_MEMBER_ERROR(517, "邀请成员失败"),

    /**
     * 邀请链接已失效
     */
    INVITE_EXPIRE(517, "当前邀请链接已失效"),

    /**
     * 非法邀请链接
     */
    INVITE_URL_ERROR(517, "非法邀请链接"),

    /**
     * 邀请邮箱未注册
     */
    INVITE_EMAIL_NOT_EXIST(517, "邀请邮箱未注册"),

    /**
     * 找不到此邮箱的邀请记录，请邀请后才能再次发送邀请
     */
    INVITE_EMAIL_NOT_FOUND(518, "此邮箱还没邀请过，不能再次发送邀请"),

    /**
     * 此邮箱已激活，请不要重复发送
     */
    INVITE_EMAIL_HAS_ACTIVE(518, "此邮箱已激活，请不要重复发送"),

    /**
     * 受邀邮箱不存在
     */
    INVITE_EMAIL_NOT_EXIT(518, "受邀邮箱不存在"),

    /**
     * 受邀邮箱已绑定其他用户，请勿重复绑定
     */
    INVITE_EMAIL_HAS_LINK(518, "受邀邮箱已绑定其他用户，请勿重复绑定"),

    /**
     * 操作频繁，请稍后再试
     */
    INVITE_TOO_OFTEN(518, "操作频繁，请稍后再试"),

    /**
     * 最多一次性上传200个成员信息，请拆分为多个文件后重新上传
     */
    EXCEL_BEYOND_MAX_ROW(519, "最多一次性上传200个成员信息，请拆分为多个文件后重新上传"),

    /**
     * 文件无法读取，请检查文件后重新上传
     */
    EXCEL_CAN_READ_ERROR(519, "文件无法读取，请检查文件后重新上传"),

    /**
     * 成员数量超过上限
     */
    NUMBER_LIMIT(520, "成员数量超过上限"),

    /**
     * 组织类型必须是成员
     */
    UNIT_MUST_MEMBER(521, "组织类型必须是成员"),

    /**
     * 组织单元不存在
     */
    UNIT_NOT_EXIST(522, "组织单元不存在"),

    /**
     * role name exist
     */
    DUPLICATION_ROLE_NAME(523, "该角色名称已存在"),

    /**
     * create role failure
     */
    CREATE_ROLE_ERROR(524, "创建角色失败"),

    /**
     * update role failure
     */
    UPDATE_ROLE_NAME_ERROR(525, "修改角色名称失败"),

    /**
     * role no exist
     */
    NOT_EXIST_ROLE(526, "该角色不存在"),

    /**
     * add role failure
     */
    ADD_ROLE_MEMBER_ERROR(527, "添加成员失败"),

    /**
     * role has members
     */
    ROLE_EXIST_ROLE_MEMBER(528, "该角色下存在成员"),

    /**
     * space has roles
     */
    SPACE_EXIST_ROLES(529, "空间站已存在该角色");

    private final Integer code;

    private final String message;
}
