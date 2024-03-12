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

import com.apitable.workspace.dto.NodeRelDTO;
import com.apitable.workspace.entity.NodeRelEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import java.util.Collection;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/**
 * node relation mapper.
 */
public interface NodeRelMapper extends BaseMapper<NodeRelEntity> {

    /**
     * query main node ids by rel node ids.
     *
     * @param relNodeIds associated node ids
     * @return MainNodeIds
     */
    List<String> selectMainNodeIdsByRelNodeIds(@Param("list") List<String> relNodeIds);

    /**
     * query by rel node id.
     *
     * @param relNodeId rel node id
     * @return node rel
     */
    NodeRelEntity selectByRelNodeId(@Param("relNodeId") String relNodeId);

    /**
     * query by rel node ids.
     *
     * @param relNodeIds associated node ids
     * @return NodeRelEntity
     */
    List<NodeRelEntity> selectByRelNodeIds(@Param("list") Collection<String> relNodeIds);

    /**
     * query dto by main node id.
     *
     * @param mainNodeId main node id
     * @return BaseNodeInfo
     */
    List<NodeRelDTO> selectNodeRelDTO(@Param("mainNodeId") String mainNodeId);

    /**
     * add node association.
     *
     * @param entities node rels
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeRelEntity> entities);
}
