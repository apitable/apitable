package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.vikadata.api.model.vo.space.SpaceRoleVo;
import com.vikadata.entity.SpaceRoleEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SpaceRoleMapper extends BaseMapper<SpaceRoleEntity> {

    /**
     * @param page    page object
     * @param spaceId space id
     * @return space role page
     */
    @InterceptorIgnore(illegalSql = "true")
    IPage<SpaceRoleVo> selectSpaceRolePage(IPage<SpaceRoleVo> page, @Param("spaceId") String spaceId);

    /**
     * delete a role based on the role code
     *
     * @param roleCode role code
     * @return affected rows
     */
    int deleteByRoleCode(@Param("roleCode") String roleCode);

    /**
     * Query the resource code set corresponding to a role
     *
     * @param id id
     * @return resource codes
     */
    List<String> selectResourceCodesById(@Param("id") Long id);

    /**
     * @param roleCodes role codes
     * @return affected rows
     */
    int batchDeleteByRoleCode(@Param("roleCodes") List<String> roleCodes);

    /**
     * query member's resource codes in space
     *
     * @param spaceId   space id
     * @param memberId  member id
     * @return resource codes
     */
    List<String> selectResourceCodesBySpaceIdAndMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

}
