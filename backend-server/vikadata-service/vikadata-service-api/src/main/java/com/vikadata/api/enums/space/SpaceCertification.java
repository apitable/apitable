package com.vikadata.api.enums.space;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * space certiication
 * </p>
 * @author zoe zheng
 */
@Getter
@AllArgsConstructor
public enum SpaceCertification {

    BASIC("basic"),

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
