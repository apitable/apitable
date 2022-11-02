package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum WidgetFileType implements IBaseEnum {
    /**
     * the widget asset
     */
    ASSET(0),
    /**
     * the packaging file
     */
    PACKAGE(1),
    /**
     * cover, icon
     */
    PUBLIC(2);


    private final Integer value;

    public static WidgetFileType of(Integer value) {
        for (WidgetFileType type : WidgetFileType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown WidgetFileType");
    }
}