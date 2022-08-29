package com.vikadata.api.cache.bean;

import lombok.Data;

import java.io.Serializable;

/**
 * <p>
 * 用户的空间资源
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/14 15:50
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
