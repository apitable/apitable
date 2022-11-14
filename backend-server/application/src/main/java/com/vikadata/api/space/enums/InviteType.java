package com.vikadata.api.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * invitation type
 * </p>
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum InviteType {

    EMAIL_INVITE(0),

    FILE_IMPORT(1),

    LINK_INVITE(2);

    private final int type;
}
