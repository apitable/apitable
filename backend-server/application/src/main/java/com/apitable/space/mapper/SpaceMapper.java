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

import com.apitable.space.dto.BaseSpaceInfoDTO;
import com.apitable.space.dto.MapDTO;
import com.apitable.space.dto.SpaceAdminInfoDTO;
import com.apitable.space.dto.SpaceDTO;
import com.apitable.space.entity.SpaceEntity;
import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * space mapper.
 */
public interface SpaceMapper extends BaseMapper<SpaceEntity> {

    /**
     * query name by space id.
     *
     * @param spaceId space id
     * @return space name
     */
    String selectSpaceNameBySpaceId(@Param("spaceId") String spaceId);

    /**
     * qyery by space id.
     *
     * @param spaceId space id
     * @return SpaceEntity
     */
    SpaceEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * query id.
     *
     * @param spaceId space id
     * @return the space infos
     */
    SpaceEntity selectBySpaceIdIgnoreDeleted(@Param("spaceId") String spaceId);

    /**
     * query info.
     *
     * @param spaceIds space ids
     * @return the space infos
     */
    List<SpaceEntity> selectBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * query by user id.
     *
     * @param userId user id
     * @return the user's space infos.
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceDTO> selectListByUserId(@Param("userId") Long userId);

    /**
     * query admin space count.
     *
     * @param userId user id
     * @return the user's space amount
     */
    @InterceptorIgnore(illegalSql = "true")
    Integer getAdminSpaceCount(@Param("userId") Long userId);

    /**
     * query main admin.
     *
     * @param spaceId space id
     * @return the main admin info
     */
    @InterceptorIgnore(illegalSql = "true")
    SpaceAdminInfoDTO selectAdminInfoDto(@Param("spaceId") String spaceId);

    /**
     * query main admin.
     *
     * @param spaceId space id
     * @return the space's main admin member id
     */
    Long selectSpaceMainAdmin(@Param("spaceId") String spaceId);

    /**
     * gets the option argument for the space.
     *
     * @param spaceId space id
     * @return props
     */
    String selectPropsBySpaceId(@Param("spaceId") String spaceId);

    /**
     * change the spatial property state.
     *
     * @param userId   user id
     * @param spaceId  space id
     * @param features features
     * @return affected rows
     */
    Integer updateProps(@Param("userId") Long userId, @Param("spaceId") String spaceId,
                        @Param("list") List<MapDTO> features);

    /**
     * change the primary administrator id of the space.
     *
     * @param spaceId   space id
     * @param memberId  the new main admin id
     * @param updatedBy updater
     * @return affected rows
     */
    Integer updateSpaceOwnerId(@Param("spaceId") String spaceId, @Param("memberId") Long memberId,
                               @Param("updatedBy") Long updatedBy);

    /**
     * remove the space main admin id.
     *
     * @param spaceId   space id
     * @param updatedBy updater
     * @return affected rows
     */
    int removeSpaceOwnerId(@Param("spaceId") String spaceId, @Param("updatedBy") Long updatedBy);

    /**
     * update .
     *
     * @param time      pre delete time
     * @param spaceId   space id
     * @param updatedBy updater
     * @return affected rows
     */
    int updatePreDeletionTimeBySpaceId(@Param("time") LocalDateTime time,
                                       @Param("spaceId") String spaceId,
                                       @Param("updatedBy") Long updatedBy);

    /**
     * logically delete space.
     *
     * @param spaceIds space ids
     * @return affected rows
     */
    int updateIsDeletedBySpaceIdIn(@Param("list") List<String> spaceIds);

    /**
     * count by space id.
     *
     * @param spaceId space id
     * @param preDel  whether it is in the pre delete state (optional)
     * @return the space amount
     */
    Integer countBySpaceId(@Param("spaceId") String spaceId, @Param("preDel") Boolean preDel);

    /**
     * get space id by user id and the prefix and suffix of a space name.
     *
     * @param userId user id
     * @param name   space name
     * @return space id
     */
    String selectSpaceIdByUserIdAndName(@Param("userId") Long userId, @Param("name") String name);

    /**
     * query space base info.
     *
     * @param spaceIds space ids
     * @return space base info
     */
    List<BaseSpaceInfoDTO> selectBaseSpaceInfo(@Param("spaceIds") List<String> spaceIds);

    /**
     * query by user id.
     *
     * @param userId user id
     * @return space info
     */
    @InterceptorIgnore(illegalSql = "true")
    List<SpaceEntity> selectByUserId(@Param("userId") Long userId);

    /**
     * query space ids by created_by.
     *
     * @param userId user id
     * @return space ids
     */
    List<String> selectSpaceIdsByUserId(@Param("userId") Long userId);
}
