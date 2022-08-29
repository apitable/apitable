package com.vikadata.api.modular.space.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SpaceRoleResourceRelEntity;

/**
 * <p>
 * 工作空间-角色权限资源关联表 服务类
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-07
 */
public interface ISpaceRoleResourceRelService extends IService<SpaceRoleResourceRelEntity> {

	/**
	 * 角色与权限关联
	 *
	 * @param roleCodes     角色编码列表
	 * @param resourceCodes 权限资源编码
	 * @author Shawn Deng
	 * @date 2020/2/13 21:56
	 */
	void createBatch(List<String> roleCodes, List<String> resourceCodes);

	/**
	 * 删除角色
	 *
	 * @param roleCode 角色编码
	 * @author Shawn Deng
	 * @date 2020/2/16 15:33
	 */
	void delete(String roleCode);

	/**
	 * 删除角色权限
	 *
	 * @param roleCode      角色编码
	 * @param resourceCodes 权限资源编码
	 * @author Shawn Deng
	 * @date 2020/2/16 15:07
	 */
	void deleteBatch(String roleCode, List<String> resourceCodes);
}
