package com.vikadata.api.workspace.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.NodeRoleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface NodeRoleMapper extends BaseMapper<NodeRoleEntity> {

	/**
	 * @param roleCode role code
	 * @return resource codes
	 */
	List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
