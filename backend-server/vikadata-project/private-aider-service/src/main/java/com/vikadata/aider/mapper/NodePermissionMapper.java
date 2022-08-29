package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.aider.model.NodeRoleDto;
import com.vikadata.entity.ControlEntity;

/**
 * <p>
 * 工作台-节点权限设置表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface NodePermissionMapper {

    List<NodeRoleDto> selectRootNodeRoleDto();

    List<NodeRoleDto> selectNodeOwnerRoleDto();

    List<NodeRoleDto> selectNodePermissionRoleDto();

    int insertControl(@Param("entities") List<ControlEntity> entities);

    int insertIntoControlRoleSelectNodePermission(@Param("ids") List<Long> ids);
}
