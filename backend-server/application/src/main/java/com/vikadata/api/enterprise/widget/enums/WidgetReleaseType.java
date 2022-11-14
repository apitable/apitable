package com.vikadata.api.enterprise.widget.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum WidgetReleaseType implements IBaseEnum {

    SPACE(0),

    GLOBAL(1),

    WAIT_REVIEW(10);

    private final Integer value;

    public static WidgetReleaseType toEnum(Integer type) {
        if (null != type) {
            for (WidgetReleaseType e : WidgetReleaseType.values()) {
                if (e.getValue().equals(type)) {
                    return e;
                }
            }
        }
        throw new BusinessException("Applet Publishing Type Error");
    }

}
