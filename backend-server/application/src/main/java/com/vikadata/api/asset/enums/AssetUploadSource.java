package com.vikadata.api.asset.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * asset upload source
 * using: CallBack Body
 *
 * @author Pengap
 */
@Getter
@AllArgsConstructor
public enum AssetUploadSource implements IBaseEnum {

    /**
     * widget static resource
     */
    WIDGET_STATIC(0),

    /**
     * space asset
     */
    SPACE_ASSET(1),

    /**
     * public asset
     */
    PUBLISH_ASSET(2),

    ;

    private final Integer value;

    public static AssetUploadSource of(Integer value) {
        for (AssetUploadSource type : AssetUploadSource.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown UploadSource");
    }

}
