package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 资源上传来源，用于CallBack Body
 *
 * @author Pengap
 * @date 2021/7/21
 */
@Getter
@AllArgsConstructor
public enum AssetUploadSource implements IBaseEnum {

    /**
     * 小程序静态资源
     */
    WIDGET_STATIC(0);

    private final Integer value;

    public static AssetUploadSource of(Integer value) {
        for (AssetUploadSource type : AssetUploadSource.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("未知的UploadSource");
    }

}
