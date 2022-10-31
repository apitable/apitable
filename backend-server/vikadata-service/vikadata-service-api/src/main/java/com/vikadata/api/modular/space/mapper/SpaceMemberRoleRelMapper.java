package com.vikadata.api.modular.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.SpaceMemberRoleRelEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface SpaceMemberRoleRelMapper extends BaseMapper<SpaceMemberRoleRelEntity> {

    /**
     * @param spaceId space id
     * @return sub admins' id
     */
    List<Long> selectSubAdminBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param spaceId space id
     * @return role codes
     */
    List<String> selectRoleCodesBySpaceId(@Param("spaceId") String spaceId);

    /**
     * @param spaceId space id
     * @param memberId member id
     * @return the space's sub admin amount
     */
    Integer selectCountBySpaceIdAndMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * @param spaceId space id
     * @param memberIds member ids
     * @return the space's sub admin amount
     */
    Integer selectCountBySpaceIdAndMemberIds(@Param("spaceId") String spaceId, @Param("memberIds") List<Long> memberIds);

    /**
     * @param spaceId space id
     * @param memberId member id
     * @return role code
     */
    String selectRoleCodeByMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * @param spaceId space id
     * @param memberId member id
     * @return affected rows
     */
    int deleteBySpaceIdAndMemberId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId);

    /**
     * @param spaceId space id
     * @param roleCodes role codes
     * @return the eixst role codes in the space
     */
    List<String> selectRoleCodesBySpaceIdAndRoleCodes(@Param("spaceId") String spaceId, @Param("roleCodes") List<String> roleCodes);

    /**
     * @param spaceId space id
     * @param roleCodes role codes
     * @return member ids
     */
    List<Long> selectMemberIdBySpaceIdAndRoleCodes(@Param("spaceId") String spaceId, @Param("roleCodes") List<String> roleCodes);

    /**
     * @param entities ref
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<SpaceMemberRoleRelEntity> entities);

    /**
     * @param spaceId space id
     * @param memberIds member ids
     * @return role codes
     */
    List<String> selectRoleCodeByMemberIds(@Param("spaceId") String spaceId, @Param("memberIds") List<Long> memberIds);

    /**
     * @param memberIds member ids
     * @return affected rows
     */
    int batchDeleteByMemberIds(@Param("memberIds") List<Long> memberIds);

    /**
     * delete all sub administrators of a space
     *
     * @param spaceId space id
     * @return affected rows
     */
    int deleteBySpaceId(@Param("spaceId") String spaceId);
}
