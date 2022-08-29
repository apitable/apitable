package com.vikadata.api.enums.attach;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

/**
 * 图片机器审核的结果类型
 *
 * @author Benson Cheung
 * @since 2020/03/21
 */
@Getter
@AllArgsConstructor
public enum AssetAuditType {

    /**
     * 机器审核不通过，属于违规类型图片
     * */
    BLOCK("block"),

    /**
     * 需要人工审核类型图片
     * */
    REVIEW("review"),

    /**
     * 机器审核通过
     * */
    NORMAL("normal");

    private final String value;

    public static AssetAuditType getByValue(String value) {
        for (AssetAuditType type : AssetAuditType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("未知的图片审核类型");
    }
}
