package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 组价发布状态
 *
 * @author Chambers
 * @since 2020/12/23
 */
@Getter
@AllArgsConstructor
public enum WidgetReleaseStatus implements IBaseEnum {

    /**
     * 待审核
     */
    WAIT_REVIEW(0),

    /**
     * 审核通过
     */
    PASS_REVIEW(1),

    /**
     * 已拒绝
     */
    REJECT(2);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
