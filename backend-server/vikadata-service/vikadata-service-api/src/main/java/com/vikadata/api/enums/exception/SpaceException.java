package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * SpaceExceptionEnum
 * 空间异常状态码
 * 状态码范围（400-409）
 *
 * @author Chambers
 * @since 2019/10/29
 */
@Getter
@AllArgsConstructor
public enum SpaceException implements BaseException {

    /**
     * 创建空间失败
     */
    CREATE_SPACE_ERROR(401, "创建空间失败"),

    /**
     * 空间太少
     */
    TOO_LITTLE_SPACE(402, "无法退出或删除唯一的工作空间"),

    /**
     * 空间退出失败
     */
    SPACE_QUIT_FAILURE(402, "主管理员不能退出空间，请先转移权限或直接删除空间"),

    /**
     * 不在空间
     */
    NOT_IN_SPACE(403, "抱歉,您已被移出此空间,不允许操作"),

    /**
     * 空间不存在
     */
    SPACE_NOT_EXIST(404, "空间不存在"),

    /**
     * 空间数量已到达上限
     */
    NUMBER_LIMIT(405, "空间数量已到达上限"),

    /**
     * 该用户可管理的空间站已超限，仅白银级的空间站可移交
     */
    USER_ADMIN_SPACE_LIMIT(405, "该用户可管理的空间站已超限，仅白银级的空间站可移交"),

    /**
     * 空间尚未激活，切换失败
     */
    CANNOT_CHANGE(406, "空间尚未激活，切换失败"),

    /**
     * 邀请的空间人数达到上限，暂时无法加入
     */
    MEMBER_LIMIT(407, "邀请的空间人数达到上限，暂时无法加入"),

    /**
     * 空间站尚未进入删除倒计时，不能直接删除
     */
    NOT_DELETED(408, "空间站尚未进入删除倒计时，不能直接删除"),

    /**
     * 删除失败
     */
    DELETE_SPACE_ERROR(408, "删除失败"),

    /**
     * 更新空间站失败
     */
    UPDATE_SPACE_INFO_FAIL(409, "更新空间站失败"),

    /**
     * 只有空间主管理员才能操作
     */
    NOT_SPACE_MAIN_ADMIN(410, "只有空间主管理员才能操作"),

    /**
     * 不允许操作
     */
    NO_ALLOW_OPERATE(411, "不允许操作"),

    /**
     * 只有空间主管理员才能操作
     */
    NOT_SPACE_ADMIN(412, "只有空间管理员才能操作"),

    /**
     * 已经认证过了
     */
    SPACE_ALREADY_CERTIFIED(413, "空间已经进行了认证，请不要重复操作");

    private final Integer code;

    private final String message;
}
