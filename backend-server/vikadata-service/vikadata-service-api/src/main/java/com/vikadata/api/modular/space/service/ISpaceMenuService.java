package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceMenuEntity;

/**
 * <p>
 * 工作空间-菜单表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface ISpaceMenuService extends IService<SpaceMenuEntity> {

	/**
	 * 根据编码查找菜单对象
	 *
	 * @param menuCode 菜单编码
	 * @return SpaceMenuEntity
	 * @author Shawn Deng
	 * @date 2020/2/16 16:41
	 */
	SpaceMenuEntity findByMenuCode(String menuCode);
}
