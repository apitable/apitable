package com.vikadata.api.shared.cache.service;

import java.util.List;

import com.vikadata.api.shared.cache.bean.SpaceMenuResourceGroupDto;

/**
 * <p>
 * space resource service
 * </p>
 *
 * @author Shawn Deng
 */
public interface SpaceResourceCacheService {

	/**
	 * resource structured data
	 *
	 * @return space menu resource group
	 */
	List<SpaceMenuResourceGroupDto> getMenuResourceGroup();
}
