package com.vikadata.api.asset.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * developer asset type
 *
 * @author Pengap
 */
@Getter
@AllArgsConstructor
public enum DeveloperAssetType implements IBaseEnum {

    /**
     * widget
     */
    WIDGET(0);

    private final Integer value;

    public static DeveloperAssetType of(Integer value) {
        for (DeveloperAssetType type : DeveloperAssetType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("unknown asset type");
    }

}
