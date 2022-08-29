package com.vikadata.api.enums.space;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 空间站企业认证
 * </p>
 * @author zoe zheng
 * @date 2022/4/6 16:03
 */
@Getter
@AllArgsConstructor
public enum SpaceCertification {

    /**
     * 基础认证
     */
    BASIC("basic"),

    /**
     * 高级认证
     */
    SENIOR("senior"),

    ;

    private final String level;


    public static SpaceCertification toEnum(String level) {
        for (SpaceCertification e : SpaceCertification.values()) {
            if (e.getLevel().equals(level)) {
                return e;
            }
        }
        return null;
    }
}
