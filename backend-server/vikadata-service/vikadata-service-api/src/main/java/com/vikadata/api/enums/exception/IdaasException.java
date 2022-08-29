package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 玉符 IDaaS 接口异常
 * </p>
 * @author 刘斌华
 * @date 2022-05-17 19:22:38
 */
@Getter
@AllArgsConstructor
public enum  IdaasException implements BaseException {

    /**
     * 内部异常
     */
    INTERNAL_ERROR(200, "内部异常"),
    /**
     * 请求参数错误
     */
    PARAM_INVALID(201, "请求参数错误"),

    /**
     * 接口请求异常
     */
    API_ERROR(210, "接口请求异常"),

    /**
     * 单点登录信息不存在
     */
    APP_NOT_FOUND(220, "单点登录信息不存在"),
    /**
     * 空间站还未绑定单点登录或者已经解绑
     */
    APP_SPACE_NOT_BIND(221, "空间站还未绑定单点登录或者已经解绑"),
    /**
     * 空间站的绑定信息异常
     */
    APP_SPACE_INVALID_BIND(222, "空间站的绑定信息异常"),

    /**
     * 只有空间站的主管理员可以操作
     */
    NOT_SPACE_MAIN_ADMIN(230, "只有空间站的主管理员可以操作"),

    /**
     * 用户还未绑定单点登录或者已经解绑
     */
    USER_NOT_BIND(240, "用户还未绑定单点登录或者已经解绑"),

    /**
     * 用户还未绑定单点登录或者已经解绑
     */
    MEMBER_NOT_BIND(250, "用户还未绑定单点登录或者已经解绑"),
    ;

    private final Integer code;

    private final String message;

}
