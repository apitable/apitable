package com.vikadata.api.cache.service;

import java.util.List;

import com.vikadata.api.cache.bean.SpaceMenuResourceGroupDto;

/**
 * <p>
 * space resource service
 * </p>
 *
 * @author Shawn Deng
 */
public interface SpaceResourceService {

	/**
	 * resource structured data
	 *
	 * @return space menu resource group
	 */
	List<SpaceMenuResourceGroupDto> getMenuResourceGroup();
}
