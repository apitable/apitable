package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * 小组件授权空间类型
 * </p>
 *
 * @author Pengap
 * @date 2021/7/9
 */
@Getter
@AllArgsConstructor
public enum WidgetPackageAuthType implements IBaseEnum {

    /**
     * 绑定空间
     */
    BOUND_SPACE(0),

    /**
     * 授权空间
     */
    AUTH_SPACE(1);

    private final Integer value;

}
