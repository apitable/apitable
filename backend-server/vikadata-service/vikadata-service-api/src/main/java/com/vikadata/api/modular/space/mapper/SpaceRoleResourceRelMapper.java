package com.vikadata.api.modular.space.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SpaceRoleResourceRelEntity;

public interface SpaceRoleResourceRelMapper extends BaseMapper<SpaceRoleResourceRelEntity> {

    /**
     * @param entities rel
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceRoleResourceRelEntity> entities);

    /**
     * @param roleCode role code
     * @return affected rows
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * @param roleCode      role code
     * @param resourceCodes resource codes
     * @return affected rows
     */
    int deleteByRoleCodeAndResourceCodes(@Param("roleCode") String roleCode, @Param("resourceCodes") List<String> resourceCodes);

    /**
     * @param resourceCodes resource codes
     * @return RoleCode
     */
    List<String> selectRoleCodeByResourceCodes(@Param("resourceCodes") List<String> resourceCodes);

    /**
     * @param roleCodes role codes
     * @return affected rows
     */
    int batchDeleteByRoleCodes(@Param("roleCodes") List<String> roleCodes);

    /**
     * @param roleCode role code
     * @return ResourceCodes
     */
    List<String> selectResourceCodesByRoleCode(@Param("roleCode") String roleCode);
}
