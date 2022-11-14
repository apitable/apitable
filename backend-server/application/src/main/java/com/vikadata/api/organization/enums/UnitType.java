package com.vikadata.api.organization.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

/**
 * <p>
 * Organization unit type
 * </p>
 *
 * @author Shawn Deng
 */
@AllArgsConstructor
@Getter
public enum UnitType {

    TEAM(1),

    ROLE(2),

	MEMBER(3);

    private final Integer type;

	public static UnitType toEnum(Integer type) {
		if (null != type) {
			for (UnitType e : UnitType.values()) {
				if (e.getType().equals(type)) {
					return e;
				}
			}
		}
		throw new BusinessException("unknown unit type");
	}
}
