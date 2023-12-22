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

package com.apitable.space.service;

import com.apitable.asset.enums.AssetType;
import com.apitable.space.dto.NodeAssetDTO;
import com.apitable.space.dto.SpaceAssetDTO;
import com.apitable.space.entity.SpaceAssetEntity;
import com.apitable.space.ro.SpaceAssetOpRo;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;
import java.util.Map;

/**
 * space asset service.
 */
public interface ISpaceAssetService extends IService<SpaceAssetEntity> {

    /**
     * save entities.
     *
     * @param entities asset info
     */
    void saveEntities(List<SpaceAssetEntity> entities);

    /**
     * create a spatial file resource reference.
     *
     * @param spaceId          space id
     * @param nodeId           nodeId
     * @param assetId          assetId
     * @param assetChecksum    assetChecksum
     * @param assetType        assetType
     * @param originalFileName originalFileName
     * @param fileSize         fileSize
     */
    void saveAssetInSpace(String spaceId, String nodeId, Long assetId, String assetChecksum,
                          AssetType assetType, String originalFileName, long fileSize);

    /**
     * update the number of references to space attachment resources.
     *
     * @param id   ID
     * @param cite citation amount
     * @param type file type
     */
    void edit(Long id, Integer cite, Integer type);

    /**
     * Changes the logical deletion state of a space attachment.
     *
     * @param nodeIds nodeIds
     * @param isDel   logical deletion status
     */
    void updateIsDeletedByNodeIds(List<String> nodeIds, Boolean isDel);

    /**
     * Copy space attachment resources referenced by nodes in batches.
     *
     * @param newNodeMap  the original node id - the target node id
     * @param destSpaceId target node's space
     */
    void copyBatch(Map<String, String> newNodeMap, String destSpaceId);

    /**
     * handles spatial attachment resources of nodes.
     *
     * @param newNodeMap   the original node id - the target node id
     * @param destSpaceId  target node's space id
     * @param assetDtoList node's assets' info list
     */
    void processNodeAssets(Map<String, String> newNodeMap, String destSpaceId,
                           List<NodeAssetDTO> assetDtoList);

    /**
     * The number of references to space attachment resources changed.
     *
     * @param spaceId space id
     * @param opRo    op parameter
     */
    void datasheetAttachmentCite(String spaceId, SpaceAssetOpRo opRo);

    /**
     * Gets the number of checksum references in the space.
     *
     * @param spaceId   space id
     * @param nodeId    target node id
     * @param assetType assetType
     * @param assetIds  asset ids
     * @return assert map
     */
    Map<String, SpaceAssetDTO> getSpaceAssetMapByAssetIdsAndType(String spaceId,
                                                                 String nodeId, AssetType assetType,
                                                                 List<Long> assetIds);
}
