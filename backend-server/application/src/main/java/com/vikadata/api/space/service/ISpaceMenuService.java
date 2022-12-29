package com.vikadata.api.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceMenuEntity;

public interface ISpaceMenuService extends IService<SpaceMenuEntity> {

	/**
	 * @param menuCode menuCode
	 * @return SpaceMenuEntity
	 */
	SpaceMenuEntity findByMenuCode(String menuCode);
}
