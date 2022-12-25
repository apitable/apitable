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

import com.apitable.workspace.dto.NodeDescDTO;
import com.apitable.workspace.entity.NodeDescEntity;

public interface NodeDescMapper extends BaseMapper<NodeDescEntity> {

    /**
     * @param nodeId node id
     * @return datasheet id
     */
    Long selectIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeId node id
     * @return the node's description
     */
    String selectDescriptionByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return node descriptions
     */
    List<NodeDescDTO> selectByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * @param nodeId node id
     * @param desc   description
     * @return affected rows
     */
    int updateDescByNodeId(@Param("nodeId") String nodeId, @Param("desc") String desc);

    /**
     * @param entities node descriptions
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeDescEntity> entities);
}
