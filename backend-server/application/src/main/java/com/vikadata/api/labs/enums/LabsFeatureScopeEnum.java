package com.vikadata.api.labs.enums;

import java.util.Objects;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum LabsFeatureScopeEnum {

    USER_SCOPE("user", 1),

    SPACE_SCOPE("space", 2),

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
