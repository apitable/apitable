package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 空间管理权限异常状态码
 *
 * @author Chambers
 * @since 2019/10/29
 */
@Getter
@AllArgsConstructor
public enum SpacePermissionException implements BaseException {

    /**
     * 权限资源不可分配
     */
    NO_RESOURCE_ASSIGNABLE(601, "权限资源不可分配"),

    /**
     * 非法分配资源
     */
    ILLEGAL_ASSIGN_RESOURCE(602, "非法分配资源"),

    /**
     * 空间管理权限不足
     */
    INSUFFICIENT_PERMISSIONS(603, "空间管理权限不足");

    private final Integer code;

    private final String message;
}
