package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 数据资源类型
 *
 * @author Chambers
 * @since 2020/12/21
 */
@Getter
@AllArgsConstructor
public enum ResourceType implements IBaseEnum {

    /**
     * 数表
     */
    DATASHEET(0),

    /**
     * 收集表
     */
    FROM(1),

    /**
     * 仪表盘
     */
    DASHBOARD(2),

    /**
     * 组件
     */
    WIDGET(3),

    /**
     * 快捷方式
     */
    MIRROR(4);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }
}
