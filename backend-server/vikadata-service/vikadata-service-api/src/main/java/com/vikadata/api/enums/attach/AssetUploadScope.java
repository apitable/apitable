package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.serializer.IBaseEnum;

/**
 * 资源上传Scope
 *
 * @author Pengap
 * @date 2021/7/21
 */
@Deprecated
@Getter
@AllArgsConstructor
public enum AssetUploadScope implements IBaseEnum {

    /**
     * 单个文件
     * <bucket>:<key>，表示只允许用户上传指定 key 的文件
     */
    SINGLE(0),

    /**
     * 多个文件
     * <bucket>:<keyPrefix>，表示允许用户上传以 scope 的 keyPrefix 为前缀的文件。
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
