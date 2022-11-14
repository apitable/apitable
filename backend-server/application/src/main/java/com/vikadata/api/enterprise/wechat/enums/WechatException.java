package com.vikadata.api.enterprise.wechat.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 *  status code range（700-799）
 * </p>
 *
 * @author Benson Cheung
 */
@Getter
@AllArgsConstructor
public enum WechatException implements BaseException {

	ILLEGAL_REQUEST(700, "Illegal request, possibly a forged request"),

    UPDATE_AUTO_REPLY_ERROR(701, "Official account automatic reply rules and keyword update failed");

    private final Integer code;

    private final String message;
}
