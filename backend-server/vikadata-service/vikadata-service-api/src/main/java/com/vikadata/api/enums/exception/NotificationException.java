package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
* <p>
 *  通知异常
 *  状态码范围（1201-1299）
 * </p>
 *
 * @author zoe zheng
 * @date 2021/3/4 12:24 下午
 */
@Getter
@AllArgsConstructor
public enum NotificationException implements BaseException {

    /**
     * 用户不存在
     */
    USER_EMPTY_ERROR(1201, "用户不存在"),
    /**
     * 成员不存在
     */
    MEMBER_EMPTY_ERROR(1202, "成员不存在"),

    /**
     * 模版发送tag错误
     */
    TMPL_TO_TAG_ERROR(1203, "模版发送tag错误"),
    /**
     * 成员提及错误
     */
    MEMBER_MENTIONED_ERROR(1204, "成员提及错误");

    private final Integer code;

    private final String message;
}
