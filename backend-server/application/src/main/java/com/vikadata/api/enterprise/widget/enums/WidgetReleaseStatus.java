package com.vikadata.api.enterprise.widget.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

@Getter
@AllArgsConstructor
public enum WidgetReleaseStatus implements IBaseEnum {

    WAIT_REVIEW(0),

    PASS_REVIEW(1),

    REJECT(2);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
