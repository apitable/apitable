package com.vikadata.api.modular.organization.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.mapper.ExpandBaseMapper;
import com.vikadata.api.modular.organization.model.RoleBaseInfoDto;
import com.vikadata.api.modular.organization.model.RoleInfoDTO;
import com.vikadata.entity.RoleEntity;

public interface RoleMapper extends ExpandBaseMapper<RoleEntity> {

    /**
     * count rows by space's id and role's name.
     *
     * @param spaceId   the space's id
     * @param roleName  the role's name
     * @return number of rows
     */
    Integer selectCountBySpaceIdAndRoleName(@Param("spaceId") String spaceId, @Param("roleName") String roleName);

    /**
     * get the space's max sequence of roles.
     *
     * @param spaceId   the space's id
     * @return sequence
     */
    Integer selectMaxSequenceBySpaceId(@Param("spaceId") String spaceId);

    /**
     * count rows by row's id and space's id.
     *
     * @param id        id
     * @param spaceId   the space's id
     * @return number of rows
     */
    Integer selectCountByIdAndSpaceId(@Param("id") Long id, @Param("spaceId") String spaceId);

    /**
     * count rows by space's id.
     *
     * @param spaceId   the space's id
     * @return number of rows
     */
    Integer selectCountBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query the space's roles list.
     *
     * @param spaceId   the space's id
     * @return role info
     */
    List<RoleInfoDTO> selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * get the role's name
     *
     * @param id ID
     * @return the role's name
     */
    String selectRoleNameById(@Param("id") Long id);

    /**
     * query roles list.
     *
     * @param ids rows' id
     * @return role info
     */
    List<RoleInfoDTO> selectRoleInfoDtoByIds(@Param("ids") List<Long> ids);

    /**
     * fuzzy search role's id by keyword.
     *
     * @param spaceId   the space's id
     * @param keyword   fuzzy search's keyword
     * @return the search result of role.
     */
    List<Long> selectIdsBySpaceIdAndLikeRoleName(@Param("spaceId") String spaceId, @Param("keyword") String keyword);

    /**
     * get the roles' base information by ids.
     *
     * @param ids the roles' id
     * @return the roles' base information.
     */
    List<RoleBaseInfoDto> selectRoleBaseInfoDtoByIds(@Param("ids") List<Long> ids);

    /**
     * query role info by ids and space id.
     *
     * @param ids       the rows' id
     * @param spaceId   the space's id
     * @return role info
     */
    List<RoleInfoDTO> selectRoleInfoDtoByIdsAndSpaceId(@Param("ids") List<Long> ids, @Param("spaceId") String spaceId);
}
