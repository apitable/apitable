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

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.apitable.workspace.dto.NodeRelDTO;
import com.apitable.workspace.entity.NodeRelEntity;

public interface NodeRelMapper extends BaseMapper<NodeRelEntity> {

    /**
     * @param relNodeIds associated node ids
     * @return MainNodeIds
     */
    List<String> selectMainNodeIdsByRelNodeIds(@Param("list") List<String> relNodeIds);

    /**
     * @param relNodeId rel node id
     * @return node rel
     */
    NodeRelEntity selectByRelNodeId(@Param("relNodeId") String relNodeId);

    /**
     * @param relNodeIds associated node ids
     * @return NodeRelEntity
     */
    List<NodeRelEntity> selectByRelNodeIds(@Param("list") Collection<String> relNodeIds);

    /**
     * @param mainNodeId main node id
     * @return BaseNodeInfo
     */
    List<NodeRelDTO> selectNodeRelDTO(@Param("mainNodeId") String mainNodeId);

    /**
     * add node association
     *
     * @param entities node rels
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeRelEntity> entities);
}
