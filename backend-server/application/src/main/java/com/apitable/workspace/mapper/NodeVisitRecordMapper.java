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

import com.apitable.workspace.entity.NodeVisitRecordEntity;
import org.apache.ibatis.annotations.Param;

/**
 * node visit record mapper.
 */
public interface NodeVisitRecordMapper {

    /**
     * query node id by member id and node type.
     *
     * @param memberId member id
     * @param nodeType node type
     * @return node id
     */
    String selectNodeIdsByMemberIdAndNodeType(@Param("memberId") Long memberId,
                                              @Param("nodeType") Integer nodeType);

    /**
     * insert node visit record.
     *
     * @param entity node visit record entity
     * @return insert count
     */
    int insert(@Param("entity") NodeVisitRecordEntity entity);

    /**
     * update node ids by member id and node type.
     *
     * @param nodeIdsStr node ids string
     * @param memberId   member id
     * @param nodeType   node type
     * @return update count
     */
    int updateNodeIdsByMemberIdAndNodeType(@Param("nodeIdsStr") String nodeIdsStr,
                                           @Param("memberId") Long memberId,
                                           @Param("nodeType") Integer nodeType);

}
