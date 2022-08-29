package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * SpaceExceptionEnum
 * 空间加入申请异常状态码
 * 状态码范围（450-）
 *
 * @author Chambers
 * @since 2020/10/29
 */
@Getter
@AllArgsConstructor
public enum SpaceApplyException implements BaseException {

    /**
     * 申请不存在
     */
    APPLY_NOT_EXIST(450, "申请不存在"),

    /**
     * 申请已失效或已被处理
     */
    APPLY_EXPIRED_OR_PROCESSED(451, "申请已失效或已被处理"),

    /**
     * 您已在该空间中，申请无效
     */
    EXIST_MEMBER(452, "您已在该空间中，申请无效"),

    /**
     * 该空间未开启加入申请允许，申请失败
     */
    APPLY_SWITCH_CLOSE(453, "该空间未开启加入申请允许，申请失败"),

    /**
     * 您已提交过申请，待管理员审批
     */
    APPLY_DUPLICATE(454, "您已提交过申请，待管理员审批"),

    /**
     * 申请消息有误
     */
    APPLY_NOTIFICATION_ERROR(455, "申请消息有误");

    private final Integer code;

    private final String message;
}
