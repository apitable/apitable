package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/5/27 16:32
 */
@Getter
@AllArgsConstructor
public enum DeveloperException implements BaseException {

    /**
     * 已经生成过令牌，不能重复操作
     */
    HAS_CREATE(1001, "不能重复生成"),

    /**
     * 生成开发者访问令牌失败
     */
    GENERATE_API_KEY_ERROR(1002, "生成开发者访问令牌失败"),

    /**
     * 用户未开通开发者平台
     */
    USER_DEVELOPER_NOT_FOUND(1003, "用户未开通开发者平台"),

    /**
     * 无效的访问令牌
     */
    INVALID_DEVELOPER_TOKEN(1004, "无效的访问令牌");

    private final Integer code;

    private final String message;
}
