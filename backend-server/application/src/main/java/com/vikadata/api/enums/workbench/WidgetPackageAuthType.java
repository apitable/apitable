package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum WidgetPackageAuthType implements IBaseEnum {

    BOUND_SPACE(0),

    AUTH_SPACE(1);

    private final Integer value;

}
