package com.vikadata.api.cache.bean;

import lombok.Data;

import java.io.Serializable;
import java.util.Set;

/**
 * <p>
 * 菜单结构化权限资源
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/16 20:35
 */
@Data
public class SpaceMenuResourceGroupDto implements Serializable {

	private static final long serialVersionUID = 6123894953955513334L;

	private String menuCode;

	private String menuName;

	private Set<SpaceResourceGroupDto> groupResources;
}
