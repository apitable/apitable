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

package com.apitable.workspace.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.apitable.workspace.entity.NodeFavoriteEntity;

public interface NodeFavoriteMapper extends BaseMapper<NodeFavoriteEntity> {

    /**
     * the favorite node ids in an orderly query
     *
     * @param memberId member id
     * @return node ids
     */
    List<String> selectOrderNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * @param memberId member id
     * @return node ids
     */
    List<String> selectNodeIdByMemberId(@Param("memberId") Long memberId);

    /**
     * @param memberId member id
     * @param nodeId node id
     * @return count
     */
    Integer countByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * @param memberId member id
     * @param nodeId node id
     * @return preNodeId
     */
    String selectPreNodeIdByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * change pre node id to other value
     *
     * @param newPreNodeId    new pre node id
     * @param originPreNodeId origin pre node id
     * @param memberId member id
     * @return affected rows
     */
    int updatePreNodeIdByMemberIdAndPreNodeId(@Param("newPreNodeId") String newPreNodeId, @Param("originPreNodeId") String originPreNodeId, @Param("memberId") Long memberId);

    /**
     * change the node's pre node id
     *
     * @param preNodeId new pre node id
     * @param memberId member id
     * @param nodeId node id
     * @return affected rows
     */
    int updatePreNodeIdByMemberIdAndNodeId(@Param("preNodeId") String preNodeId, @Param("memberId") Long memberId, @Param("nodeId") String nodeId);

    /**
     * cancel favorite（hard delete）
     *
     * @param memberId member id
     * @param nodeId node id
     * @return affected rows
     */
    int deleteByMemberIdAndNodeId(@Param("memberId") Long memberId, @Param("nodeId") String nodeId);
}
