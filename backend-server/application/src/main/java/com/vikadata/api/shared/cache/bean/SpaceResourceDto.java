package com.vikadata.api.shared.cache.bean;

import java.io.Serializable;

import lombok.Data;

/**
 * <p>
 * resource in user space
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class SpaceResourceDto implements Serializable {

	private static final long serialVersionUID = 3010701075278742759L;

	private String resourceCode;

	private String resourceName;

	private String resourceDesc;

	private Boolean assignable;

	private String groupCode;

	private String groupName;

	private String groupDesc;

	private String menuCode;

	private String menuName;
}
