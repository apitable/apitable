package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * DataSheetException
 * 数表异常状态码
 * 状态码范围（440-449）
 *
 * @author Chambers
 * @since 2019/10/30
 */
@Getter
@AllArgsConstructor
public enum DataSheetException implements BaseException {

    /**
     * 维格表不存在
     */
    DATASHEET_NOT_EXIST(440, "维格表不存在"),

    /**
     * 视图不存在
     */
    VIEW_NOT_EXIST(440, "视图不存在"),

    /**
     * 字段不存在
     */
    FIELD_NOT_EXIST(440, "字段不存在"),

    /**
     * 新建维格视图超出限制
     */
    VIEW_EXCEED_LIMIT(441, "新建维格视图超出限制"),

    /**
     * 数表相关版本号校验
     */
    CREATE_FAIL(442, "创建文件失败"),

    /**
     * 数表相关版本号校验
     */
    ATTACH_CITE_FAIL(443, "附件引用计算失败");

    private final Integer code;

    private final String message;
}
