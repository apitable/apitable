package com.vikadata.api.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceResourceEntity;

import java.util.List;

public interface ISpaceResourceService extends IService<SpaceResourceEntity> {

	/**
     * Query whether the resource code contains unassigned resource code
	 *
	 * @param resourceCodes resourceCodes
	 */
	void checkResourceAssignable(List<String> resourceCodes);
}
