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

import com.apitable.workspace.vo.FavoriteNodeInfo;
import java.util.List;

/**
 * node favorite service.
 */
public interface INodeFavoriteService {

    /**
     * get the favorite node ids by member id.
     *
     * @param memberId member id
     * @return FavoriteNodeIds
     */
    List<String> getFavoriteNodeIdsByMemberId(Long memberId);

    /**
     * get favorite node list of space.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @return FavoriteNodeInfos
     */
    List<FavoriteNodeInfo> getFavoriteNodeList(String spaceId, Long memberId);

    /**
     * move the location of the favorite node.
     *
     * @param memberId  member id
     * @param nodeId    node id
     * @param preNodeId the front node of the target position
     */
    void move(Long memberId, String nodeId, String preNodeId);

    /**
     * change the favorite status of the node.
     *
     * @param spaceId  space id
     * @param memberId member id
     * @param nodeId   node id
     */
    void updateFavoriteStatus(String spaceId, Long memberId, String nodeId);
}
