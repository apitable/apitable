package com.vikadata.api.labs.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

@Getter
@AllArgsConstructor
public enum LabsFeatureException implements BaseException {

    SPACE_ID_NOT_EMPTY(952, "space id must not be empty"),

    FEATURE_KEY_IS_NOT_EXIST(953, "feature key does not exist"),

    FEATURE_SCOPE_IS_NOT_EXIST(954, "feature scope does not exist"),

    FEATURE_TYPE_IS_NOT_EXIST(955, "feature type does not exist"),

    FEATURE_ATTRIBUTE_AT_LEAST_ONE(956,"feature attribute at least one");

    private final Integer code;

    private final String message;
}
