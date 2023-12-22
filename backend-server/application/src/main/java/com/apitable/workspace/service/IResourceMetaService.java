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

import com.apitable.workspace.dto.NodeDescParseDTO;
import com.apitable.workspace.enums.ResourceType;
import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * resource meta service.
 */
public interface IResourceMetaService {

    /**
     * batch copy resource metadata.
     *
     * @param userId           user id
     * @param originResourceId Original resource node ID list
     * @param newResourceMap   Original node ID-newly created node ID MAP
     */
    void copyBatch(Long userId, Collection<String> originResourceId,
                   Map<String, String> newResourceMap);

    /**
     * create resource metadata.
     *
     * @param userId       user id
     * @param resourceId   resourceId
     * @param resourceType resourceType
     * @param metaData     metaData
     */
    void create(Long userId, String resourceId, Integer resourceType, String metaData);

    /**
     * copy resource metadata configuration.
     *
     * @param userId      user id
     * @param spaceId     space id
     * @param originRscId source resource id
     * @param destRscId   target resource id
     * @param type        resource type
     */
    void copyResourceMeta(Long userId, String spaceId, String originRscId, String destRscId,
                          ResourceType type);

    /**
     * batch replication resource metadata configuration.
     *
     * @param userId       user id
     * @param spaceId      space id
     * @param originRscIds source resource id list
     * @param newNodeMap   Source node ID-newly created node ID MAP
     * @param type         resource type
     */
    void batchCopyResourceMeta(Long userId, String spaceId, List<String> originRscIds,
                               Map<String, String> newNodeMap, ResourceType type);

    /**
     * parse form description.
     *
     * @param formId formId
     * @return NodeDescParseDTO
     */
    NodeDescParseDTO parseFormDescByFormId(String formId);
}
