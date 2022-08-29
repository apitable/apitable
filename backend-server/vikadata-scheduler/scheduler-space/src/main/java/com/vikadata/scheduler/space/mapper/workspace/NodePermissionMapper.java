package com.vikadata.scheduler.space.mapper.workspace;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.ControlEntity;
import com.vikadata.scheduler.space.model.NodeRoleDto;
import com.vikadata.scheduler.space.model.NodeRoleInfo;

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

    Long selectControlRoleInitMaxId();

    List<Long> selectCreateList(@Param("minId") Long minId);

    List<NodeRoleInfo> selectChangeList();

    int updateControlRoleById(@Param("id") Long id, @Param("roleCode") String roleCode, @Param("updatedAt") LocalDateTime updatedAt);

    List<Long> selectControlRoleDelIds(@Param("maxId") Long maxId);

    int deleteControlRoleByIds(@Param("ids") List<Long> ids);

    List<String> selectInitNodeControlIds();

    List<NodeRoleDto> selectControlRoleDto();

    int deleteControlByIds(@Param("controlIds") Collection<String> controlIds);
}
