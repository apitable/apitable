package com.vikadata.api.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Space Join Status
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpaceApplyStatus {

    PENDING(0),

    APPROVE(1),

    REFUSE(2),

    INVALIDATION(3);

    private final Integer status;
}
