package com.vikadata.api.enterprise.widget.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum WidgetPackageType implements IBaseEnum {

    THIRD_PARTY(0),

    OFFICIAL(1);

    private final Integer value;

    public static WidgetPackageType toEnum(Integer type) {
        if (null != type) {
            for (WidgetPackageType e : WidgetPackageType.values()) {
                if (e.getValue().equals(type)) {
                    return e;
                }
            }
        }
        throw new BusinessException("Wrong widget package type");
    }
}
