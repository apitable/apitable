package com.vikadata.api.cache.service;

import com.vikadata.api.cache.bean.SpaceMenuResourceGroupDto;

import java.util.List;

/**
 * <p>
 * 空间资源工厂
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/15 19:36
 */
public interface SpaceResourceFactory {

	/**
	 * 资源结构化数据
	 *
	 * @return 菜单权限分组资源
	 * @author Shawn Deng
	 * @date 2020/2/16 21:16
	 */
	List<SpaceMenuResourceGroupDto> getMenuResourceGroup();
}
