package com.vikadata.api.space.service;

import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.entity.SpaceRoleResourceRelEntity;

public interface ISpaceRoleResourceRelService extends IService<SpaceRoleResourceRelEntity> {

	/**
	 * space roles are associated with permissions
	 *
	 * @param roleCodes     roleCodes
	 * @param resourceCodes resourceCodes
	 */
	void createBatch(List<String> roleCodes, List<String> resourceCodes);

	/**
	 * delete space role
	 *
	 * @param roleCode roleCode
	 */
	void delete(String roleCode);

	/**
     * delete space role's permission
	 *
	 * @param roleCode      roleCode
	 * @param resourceCodes resourceCodes
	 */
	void deleteBatch(String roleCode, List<String> resourceCodes);
}
