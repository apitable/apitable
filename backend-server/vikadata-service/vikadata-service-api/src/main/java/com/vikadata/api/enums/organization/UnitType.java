package com.vikadata.api.enums.organization;

import com.vikadata.core.exception.BusinessException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 组织单元类型
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/23 11:50
 */
@AllArgsConstructor
@Getter
public enum UnitType {

    /**
     * 部门
     */
    TEAM(1),

    /**
     * 标签
     */
    TAG(2),

	/**
	 * 成员
	 */
	MEMBER(3);

    private Integer type;

	public static UnitType toEnum(Integer type) {
		if (null != type) {
			for (UnitType e : UnitType.values()) {
				if (e.getType().equals(type)) {
					return e;
				}
			}
		}
		throw new BusinessException("组织单元类型解析失败");
	}
}
