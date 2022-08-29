package com.vikadata.api.enums.exception;

import com.vikadata.core.exception.BaseException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 数据库模块异常,直接抛出即可，框架自动捕获
 * 状态码范围（210-219）
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/21 13:24
 */
@Getter
@AllArgsConstructor
public enum DatabaseException implements BaseException {

    /**
     * 查询结果为空，数据不存在
     */
    QUERY_EMPTY_BY_ID(210, "数据不存在"),

    /**
     * 添加数据失败
     */
    INSERT_ERROR(211, "添加数据失败"),

    /**
     * 修改数据失败
     */
    EDIT_ERROR(212, "修改数据失败"),

    /**
     * 删除数据失败
     */
    DELETE_ERROR(213, "删除数据失败");
    
    private final Integer code;

    private final String message;
}
