package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 *  微信异常状态码
 *  状态码范围（700-799）
 * </p>
 *
 * @author Benson CHeung
 * @date 2020/02/17 14:42
 */
public enum WechatException implements BaseException {

    /**
     * 非法请求
     */
	ILLEGAL_REQUEST(700, "非法请求，可能属于伪造的请求"),

    /**
     * 公众号自动回复规则与关键词更新失败
     */
    UPDATE_AUTO_REPLY_ERROR(701, "公众号自动回复规则与关键词更新失败");

    private final Integer code;

    private final String message;

    WechatException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public Integer getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
