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

package com.apitable.workspace.service;

import com.apitable.workspace.vo.RubbishNodeVo;
import java.util.List;

/**
 * node rubbish service.
 */
public interface INodeRubbishService {

    /**
     * get the list of rubbish node.
     *
     * @param spaceId    space id
     * @param memberId   member id
     * @param size       expected load quantity（May be because the total number or permissions are not enough）
     * @param lastNodeId id of the last node in the loaded list
     * @return DeletedNodeVo
     */
    List<RubbishNodeVo> getRubbishNodeList(String spaceId, Long memberId, Integer size,
                                           String lastNodeId);

    /**
     * Check whether the rubbish node exists and whether the members have permissions.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeId   node id
     */
    void checkRubbishNode(String spaceId, Long memberId, String nodeId);

    /**
     * restore the node of the rubbish.
     *
     * @param userId   user id
     * @param nodeId   the id of the restored node
     * @param parentId parent node of recovery location
     */
    void recoverRubbishNode(Long userId, String nodeId, String parentId);

    /**
     * delete rubbish node.
     *
     * @param userId user id
     * @param nodeId the id of the cleared node
     */
    void delRubbishNode(Long userId, String nodeId);
}
