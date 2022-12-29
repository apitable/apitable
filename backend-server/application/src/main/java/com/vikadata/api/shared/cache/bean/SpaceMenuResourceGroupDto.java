package com.vikadata.api.shared.cache.bean;

import java.io.Serializable;
import java.util.Set;

import lombok.Data;

/**
 * <p>
 * menu resource in space
 * </p>
 *
 * @author Shawn Deng
 */
@Data
public class SpaceMenuResourceGroupDto implements Serializable {

	private static final long serialVersionUID = 6123894953955513334L;

	private String menuCode;

	private String menuName;

	private Set<SpaceResourceGroupDto> groupResources;
}
