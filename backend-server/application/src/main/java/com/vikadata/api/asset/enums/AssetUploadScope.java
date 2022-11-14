package com.vikadata.api.asset.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * asset upload scope
 *
 * @author Pengap
 */
@Deprecated
@Getter
@AllArgsConstructor
public enum AssetUploadScope implements IBaseEnum {

    /**
     * single file
     * bucket:key，Indicates that only users are allowed to upload files with the specified key
     */
    SINGLE(0),

    /**
     * multiple files
     * bucket:keyPrefix，Indicates that users are allowed to upload files prefixed with the scope's keyPrefix.
     */
    MULTIPLE(1);

    private final Integer value;

    public static AssetUploadScope of(Integer value) {
        for (AssetUploadScope type : AssetUploadScope.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown Upload Scope!");
    }

}
