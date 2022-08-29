package com.vikadata.api.enums.labs;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Objects;

/**
 * <p>
 * 实验性功能作用域枚举类
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2021/10/26 17:14:55
 */
@Getter
@AllArgsConstructor
public enum LabsFeatureScopeEnum {

    /**
     * 用户级别功能
     * */
    USER_SCOPE("user", 1),

    /**
     * 空间站级别功能
     * */
    SPACE_SCOPE("space", 2),

    /**
     * 未知用户级别功能
     * */
    UNKNOWN_SCOPE("unknown", 0);

    private final String scopeName;

    private final Integer scopeCode;

    public static LabsFeatureScopeEnum ofLabsFeatureScope(Integer scopeCode) {
        for (LabsFeatureScopeEnum scopeEnum : LabsFeatureScopeEnum.values()) {
            if (Objects.equals(scopeCode, scopeEnum.getScopeCode())) {
                return scopeEnum;
            }
        }
        return UNKNOWN_SCOPE;
    }

    public static LabsFeatureScopeEnum ofLabsFeatureScope(String scopeName) {
        if (StrUtil.isBlank(scopeName)) {
            return UNKNOWN_SCOPE;
        }
        for (LabsFeatureScopeEnum scopeEnum : LabsFeatureScopeEnum.values()) {
            if (Objects.equals(scopeName, scopeEnum.getScopeName())) {
                return scopeEnum;
            }
        }
        return UNKNOWN_SCOPE;
    }
}
