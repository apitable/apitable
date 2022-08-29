package com.vikadata.api.enums.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * <p>
 * 内测实验室功能异常状态码
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/30 21:43:28
 * */
@Getter
@AllArgsConstructor
public enum LabsFeatureException implements BaseException {

    /**
     * 空间站ID不得为空
     * */
    SPACE_ID_NOT_EMPTY(952, "空间站ID不得为空"),

    /**
     * 实验性功能唯一标识不存在
     * */
    FEATURE_KEY_IS_NOT_EXIST(953, "实验性功能唯一标识不存在"),

    /**
     * 实验室功能作用域不存在
     * */
    FEATURE_SCOPE_IS_NOT_EXIST(954, "实验室功能只能为user或者space"),

    /**
     * 实验室功能类型
     * */
    FEATURE_TYPE_IS_NOT_EXIST(955, "实验室功能类型仅支持static | review | normal | normal_persist"),

    /**
     * 实验室功能属性修改值至少为1
     * */
    FEATURE_ATTRIBUTE_AT_LEAST_ONE(956,"实验室功能属性scope ｜ type ｜ url修改值至少为1");


    private final Integer code;

    private final String message;
}
