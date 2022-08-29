package com.vikadata.api.modular.space.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.vikadata.entity.SpaceResourceEntity;

import java.util.List;

/**
 * <p>
 * 工作空间-权限资源表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface ISpaceResourceService extends IService<SpaceResourceEntity> {

	/**
	 * 查询资源编码是否包含了不可分配
	 *
	 * @param resourceCodes 资源编码列表
	 * @author Shawn Deng
	 * @date 2020/2/13 23:27
	 */
	void checkResourceAssignable(List<String> resourceCodes);
}
