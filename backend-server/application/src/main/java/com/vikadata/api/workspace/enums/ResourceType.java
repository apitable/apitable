package com.vikadata.api.workspace.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum ResourceType implements IBaseEnum {

    DATASHEET(0),

    FROM(1),

    DASHBOARD(2),

    WIDGET(3),

    MIRROR(4);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
