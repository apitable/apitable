package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * 小组件包类型
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Getter
@AllArgsConstructor
public enum WidgetPackageType implements IBaseEnum {

    /**
     * 第三方
     */
    THIRD_PARTY(0),

    /**
     * 官方
     */
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
        throw new BusinessException("小组件包类型错误");
    }
}
