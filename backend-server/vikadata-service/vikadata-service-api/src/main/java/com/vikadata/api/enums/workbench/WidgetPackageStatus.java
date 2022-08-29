package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 组件包状态
 *
 * @author Chambers
 * @since 2020/12/23
 */
@Getter
@AllArgsConstructor
public enum WidgetPackageStatus implements IBaseEnum {

    /**
     * 开发中
     */
    DEVELOP(0),

    /**
     * 已封禁
     */
    BANNED(1),

    /**
     * 待发布
     */
    UNPUBLISHED(2),

    /**
     * 已发布
     */
    ONLINE(3),

    /**
     * 已下架
     */
    UNPUBLISH(4);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
