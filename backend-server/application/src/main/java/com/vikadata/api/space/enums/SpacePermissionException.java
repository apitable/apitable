package com.vikadata.api.space.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BaseException;

/**
 * space permission exception
 *
 * @author Chambers
 */
@Getter
@AllArgsConstructor
public enum SpacePermissionException implements BaseException {

    NO_RESOURCE_ASSIGNABLE(601, "Permission resources are not assignable"),

    ILLEGAL_ASSIGN_RESOURCE(602, "Illegal allocation of resources"),

    INSUFFICIENT_PERMISSIONS(603, "Insufficient space management rights");

    private final Integer code;

    private final String message;
}
