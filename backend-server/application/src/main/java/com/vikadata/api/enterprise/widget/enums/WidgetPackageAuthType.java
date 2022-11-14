package com.vikadata.api.enterprise.widget.enums;

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
