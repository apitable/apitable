package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.aider.model.NodeRoleDto;
import com.vikadata.entity.ControlEntity;

/**
 * <p>
 * workbench - node permission mapper
 * </p>
 */
public interface NodePermissionMapper {

    List<NodeRoleDto> selectRootNodeRoleDto();

    List<NodeRoleDto> selectNodeOwnerRoleDto();

    List<NodeRoleDto> selectNodePermissionRoleDto();

    int insertControl(@Param("entities") List<ControlEntity> entities);

    int insertIntoControlRoleSelectNodePermission(@Param("ids") List<Long> ids);
}
