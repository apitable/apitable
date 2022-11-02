package com.vikadata.api.modular.space.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.model.dto.space.NodeAssetDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.api.model.ro.space.SpaceAssetOpRo;
import com.vikadata.entity.SpaceAssetEntity;

public interface ISpaceAssetService extends IService<SpaceAssetEntity> {

    /**
     * @param entities asset info
     */
    void saveEntities(List<SpaceAssetEntity> entities);

    /**
     * create a spatial file resource reference
     *
     * @param spaceId space id
     * @param nodeId           nodeId
     * @param assetId          assetId
     * @param assetChecksum    assetChecksum
     * @param assetType        assetType
     * @param originalFileName originalFileName
     * @param fileSize         fileSize
     */
    void saveAssetInSpace(String spaceId, String nodeId, Long assetId, String assetChecksum, AssetType assetType, String originalFileName, long fileSize);

    /**
     * @param id   ID
     * @param cite citation amount
     * @param type file type
     */
    void edit(Long id, Integer cite, Integer type);

    /**
     * Changes the logical deletion state of a space attachment
     *
     * @param nodeIds nodeIds
     * @param isDel   logical deletion status
     */
    void updateIsDeletedByNodeIds(List<String> nodeIds, Boolean isDel);

    /**
     * Copy space attachment resources referenced by nodes in batches
     *
     * @param newNodeMap  the original node id - the target node id
     * @param destSpaceId target node's space
     */
    void copyBatch(Map<String, String> newNodeMap, String destSpaceId);

    /**
     * handles spatial attachment resources of nodes
     *
     * @param newNodeMap   the original node id - the target node id
     * @param destSpaceId  target node's space id
     * @param assetDtoList node's assets' info list
     */
    void processNodeAssets(Map<String, String> newNodeMap, String destSpaceId, List<NodeAssetDto> assetDtoList);

    /**
     * The number of references to space attachment resources changed
     *
     * @param spaceId space id
     * @param opRo    op parameter
     */
    void datasheetAttachmentCite(String spaceId, SpaceAssetOpRo opRo);

    /**
     * Gets the number of checksum references in the space
     *
     * @param spaceId space id
     * @param nodeId    target node id
     * @param assetType assetType
     * @param assetIds asset ids
     * @return Map<checksum, SpaceAssetDto>
     */
    Map<String, SpaceAssetDto> getSpaceAssetMapByAssetIdsAndType(String spaceId,
            String nodeId, AssetType assetType, List<Long> assetIds);

    /**
     * @param entities SpaceAssetEntity
     * @return create successful or not
     */
    boolean createBatch(List<SpaceAssetEntity> entities);

    /**
     * @param entities SpaceAssetEntity
     * @return update successful or not
     */
    boolean updateBatchById(List<SpaceAssetEntity> entities);
}
