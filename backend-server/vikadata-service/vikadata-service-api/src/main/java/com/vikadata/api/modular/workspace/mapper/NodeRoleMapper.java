package com.vikadata.api.modular.workspace.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.NodeRoleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 工作台-节点-角色表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-02-18
 */
public interface NodeRoleMapper extends BaseMapper<NodeRoleEntity> {

	/**
	 * 根据角色编码查询资源编码列表
	 *
	 * @param roleCode 角色编码
	 * @return 资源列表
	 * @author Shawn Deng
	 * @date 2020/2/21 00:44
	 */
	List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
