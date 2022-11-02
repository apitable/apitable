package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * asset type
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum AssetType implements IBaseEnum {

    USER_AVATAR(0),

    SPACE_LOGO(1),

    DATASHEET(2),

    COVER(3),

    NODE_DESC(4);

    private final int value;

    @Override
    public Integer getValue() {
        return this.value;
    }

    public static AssetType of(Integer value) {
        for (AssetType type : AssetType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("unknown attachment type");
    }

    public static boolean isSpaceAsset(AssetType type) {
        return type.equals(DATASHEET) || type.equals(COVER) || type.equals(NODE_DESC);
    }

    public static boolean isPublishAsset(Integer value) {
        AssetType type = AssetType.of(value);
        return type.equals(USER_AVATAR) || type.equals(SPACE_LOGO);
    }
}
