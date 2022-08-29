package com.vikadata.api.enums.workbench;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * <p>
 * 小程序发布类型
 * </p>
 *
 * @author Pengap
 * @date 2021/7/8
 */
@Getter
@AllArgsConstructor
public enum WidgetReleaseType implements IBaseEnum {

    /**
     * 空间站
     */
    SPACE(0),

    /**
     * 全局
     */
    GLOBAL(1),

    /**
     * 待审核小程序，用于Submit命令后出现的镜像
     */
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
        throw new BusinessException("小程序发布类型错误");
    }

}
