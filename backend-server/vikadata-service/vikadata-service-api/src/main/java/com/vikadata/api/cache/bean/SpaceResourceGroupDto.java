package com.vikadata.api.cache.bean;

import lombok.Data;

import java.io.Serializable;
import java.util.Set;

/**
 * <p>
 * 资源分组对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/16 20:38
 */
@Data
public class SpaceResourceGroupDto implements Serializable {

	private static final long serialVersionUID = -4899518764333069317L;

	private String groupCode;

	private String groupName;

	private String groupDesc;

	private Set<String> resourceCodes;
}
