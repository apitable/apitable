package com.vikadata.api.shared.cache.bean;

import java.io.Serializable;
import java.util.Set;

import lombok.Data;

/**
 * <p>
 * resource group
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class SpaceResourceGroupDto implements Serializable {

	private static final long serialVersionUID = -4899518764333069317L;

	private String groupCode;

	private String groupName;

	private String groupDesc;

	private Set<String> resourceCodes;
}
