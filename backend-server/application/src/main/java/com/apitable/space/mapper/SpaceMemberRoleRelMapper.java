/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.apitable.space.entity.SpaceMemberRoleRelEntity;
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
