package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 开发者资源类型
 *
 * @author Pengap
 * @date 2021/7/21
 */
@Getter
@AllArgsConstructor
public enum DeveloperAssetType implements IBaseEnum {

    /**
     * 小组件
     */
    WIDGET(0);

    private final Integer value;

    public static DeveloperAssetType of(Integer value) {
        for (DeveloperAssetType type : DeveloperAssetType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("未知的附件类型");
    }

}
