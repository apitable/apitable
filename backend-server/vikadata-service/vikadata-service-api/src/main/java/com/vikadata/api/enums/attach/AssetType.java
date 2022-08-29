package com.vikadata.api.enums.attach;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 资源类型
 *
 * @author Chambers
 * @since 2019/11/7
 */
@Getter
@AllArgsConstructor
public enum AssetType implements IBaseEnum {

    /**
     * 用户头像
     */
    USER_AVATAR(0),

    /**
     * 空间logo
     */
    SPACE_LOGO(1),

    /**
     * 数表附件
     */
    DATASHEET(2),

    /**
     * 封面图
     */
    COVER(3),

    /**
     * 节点描述图
     */
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
        throw new BusinessException("未知的附件类型");
    }

    public static boolean isSpaceAsset(AssetType type) {
        return type.equals(DATASHEET) || type.equals(COVER) || type.equals(NODE_DESC);
    }
}
