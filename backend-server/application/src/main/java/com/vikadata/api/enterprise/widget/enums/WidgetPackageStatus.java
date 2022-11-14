package com.vikadata.api.enterprise.widget.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum WidgetPackageStatus implements IBaseEnum {

    DEVELOP(0),

    BANNED(1),

    UNPUBLISHED(2),

    ONLINE(3),

    UNPUBLISH(4);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
