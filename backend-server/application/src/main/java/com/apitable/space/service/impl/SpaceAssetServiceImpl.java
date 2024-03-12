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

package com.apitable.space.service.impl;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import com.apitable.asset.entity.AssetEntity;
import com.apitable.asset.enums.AssetType;
import com.apitable.asset.mapper.AssetMapper;
import com.apitable.base.enums.DatabaseException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.cache.service.SpaceCapacityCacheService;
import com.apitable.space.dto.NodeAssetDTO;
import com.apitable.space.dto.SpaceAssetDTO;
import com.apitable.space.entity.SpaceAssetEntity;
import com.apitable.space.mapper.SpaceAssetMapper;
import com.apitable.space.ro.SpaceAssetOpRo;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.workspace.enums.DataSheetException;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * space asset service implement.
 */
@Slf4j
@Service
public class SpaceAssetServiceImpl extends ServiceImpl<SpaceAssetMapper, SpaceAssetEntity>
    implements ISpaceAssetService {

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Override
    public void saveEntities(List<SpaceAssetEntity> entities) {
        log.info("Save space asset.");
        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        // delete the capacity cache
        spaceCapacityCacheService.del(entities.get(0).getSpaceId());
    }

    @Override
    public void saveAssetInSpace(String spaceId, String nodeId, Long assetId, String assetChecksum,
                                 AssetType assetType, String originalFileName, long fileSize) {
        log.info("add space asset");
        SpaceAssetEntity entity = SpaceAssetEntity.builder()
            .spaceId(spaceId)
            .nodeId(nodeId)
            .assetId(assetId)
            .assetChecksum(assetChecksum)
            .type(assetType.getValue())
            .sourceName(originalFileName)
            .fileSize((int) fileSize)
            .build();
        this.save(entity);
        // delete the capacity cache
        spaceCapacityCacheService.del(spaceId);
    }

    @Override
    public void edit(Long id, Integer cite, Integer type) {
        log.info("edit space asset");
        SpaceAssetEntity entity = SpaceAssetEntity.builder()
            .id(id).cite(cite).type(type).isDeleted(false).build();
        boolean flag = this.updateById(entity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void updateIsDeletedByNodeIds(List<String> nodeIds, Boolean isDel) {
        log.info("Changes the logical deletion state of a space attachment");
        baseMapper.updateIsDeletedByNodeIds(nodeIds, isDel);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyBatch(Map<String, String> newNodeMap, String destSpaceId) {
        log.info("Copy space attachment resources referenced by nodes in batches");
        if (MapUtil.isEmpty(newNodeMap)) {
            return;
        }
        List<NodeAssetDTO> assetDtoList =
            baseMapper.selectNodeAssetDto(CollUtil.newArrayList(newNodeMap.keySet()));
        this.processNodeAssets(newNodeMap, destSpaceId, assetDtoList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void processNodeAssets(Map<String, String> newNodeMap,
                                  String destSpaceId, List<NodeAssetDTO> assetDtoList) {
        log.info("handles spatial attachment resources of nodes");
        if (CollUtil.isEmpty(assetDtoList)) {
            return;
        }
        List<SpaceAssetEntity> entities = new ArrayList<>();
        assetDtoList.forEach(asset -> {
            SpaceAssetEntity entity = SpaceAssetEntity.builder()
                .id(IdWorker.getId())
                .spaceId(destSpaceId)
                .nodeId(newNodeMap.get(asset.getNodeId()))
                .assetId(asset.getAssetId())
                .assetChecksum(asset.getChecksum())
                .type(asset.getType())
                .sourceName(asset.getSourceName())
                .cite(asset.getCite())
                .fileSize(asset.getFileSize())
                .isTemplate(Optional.ofNullable(asset.getIsTemplate()).orElse(false))
                .build();
            entities.add(entity);
        });
        this.saveEntities(entities);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void datasheetAttachmentCite(String spaceId, SpaceAssetOpRo opRo) {
        log.info("The number of references to space attachment resources changed");
        if (CollUtil.isEmpty(opRo.getAddToken()) && CollUtil.isEmpty(opRo.getRemoveToken())) {
            return;
        }
        String nodeId = opRo.getNodeId();
        // collecting token counts, To map, which guarantees uniqueness.
        Map<String, AssetCiteDto> tokenCountMap =
            calTokenCount(opRo.getAddToken(), opRo.getRemoveToken());
        // Obtain the attachment that the token already exists in the resource library
        List<AssetEntity> baseAssets = assetMapper.selectByFileUrl(tokenCountMap.keySet());
        // Images that differ in token across environment templates but whose checksum has been written, or images from unknown sources
        if (CollUtil.isEmpty(baseAssets)) {
            log.error("the base attachment cannot be found:[{}]", tokenCountMap.keySet());
            return;
        }
        // Get the checksum to query for spatial attachment resources
        List<Long> assetIds =
            baseAssets.stream().map(AssetEntity::getId).collect(Collectors.toList());
        // get the spatial datasheet attachment
        Map<String, SpaceAssetDTO> spaceAssetDtoMap =
            getSpaceAssetMapByAssetIdsAndType(spaceId, nodeId, AssetType.DATASHEET, assetIds);
        List<SpaceAssetEntity> addEntities = new ArrayList<>();
        List<SpaceAssetEntity> updateEntities = new ArrayList<>();
        List<Long> delSpaceAssetId = new ArrayList<>();
        // statistics write and update entities
        baseAssets.forEach(item -> {
            // need to modify
            if (spaceAssetDtoMap.containsKey(item.getChecksum())) {
                int cite =
                    spaceAssetDtoMap.get(item.getChecksum()).getCite()
                        + tokenCountMap.get(item.getFileUrl()).getCite();
                Long id = spaceAssetDtoMap.get(item.getChecksum()).getId();
                // Collect the id of the record whose cite is less than or equal to zero
                if (cite <= 0) {
                    delSpaceAssetId.add(id);
                } else {
                    updateEntities.add(
                        SpaceAssetEntity.builder().id(id).cite(cite).build());
                }
            } else {
                // need to add
                addEntities.add(
                    SpaceAssetEntity.builder().id(IdWorker.getId()).spaceId(spaceId).nodeId(nodeId)
                        .assetId(item.getId()).cite(tokenCountMap.get(item.getFileUrl()).getCite())
                        .assetChecksum(item.getChecksum()).type(AssetType.DATASHEET.getValue())
                        .sourceName(tokenCountMap.get(item.getFileUrl()).getName())
                        .fileSize(item.getFileSize())
                        .isTemplate(item.getIsTemplate()).build());
            }
        });
        if (CollUtil.isNotEmpty(updateEntities)) {
            boolean updateFlag = updateBatchById(updateEntities, updateEntities.size());
            ExceptionUtil.isTrue(updateFlag, DataSheetException.ATTACH_CITE_FAIL);
        }
        if (CollUtil.isNotEmpty(addEntities)) {
            boolean insertFlag = SqlHelper.retBool(baseMapper.insertBatch(addEntities));
            ExceptionUtil.isTrue(insertFlag, DataSheetException.ATTACH_CITE_FAIL);
        }
        // delete a reference to a space resource（physically-deleted）
        if (!delSpaceAssetId.isEmpty()) {
            boolean flag = SqlHelper.retBool(baseMapper.deleteBatchByIds(delSpaceAssetId));
            ExceptionUtil.isTrue(flag, DataSheetException.ATTACH_CITE_FAIL);
        }
        // delete the capacity cache
        spaceCapacityCacheService.del(spaceId);
    }

    @Override
    public Map<String, SpaceAssetDTO> getSpaceAssetMapByAssetIdsAndType(String spaceId,
                                                                        String nodeId,
                                                                        AssetType assetType,
                                                                        List<Long> assetIds) {
        List<SpaceAssetDTO> spaceAssetDTOList =
            baseMapper.selectDtoByAssetIdsAndType(spaceId, nodeId, assetType.getValue(), assetIds);
        return spaceAssetDTOList.stream()
            .collect(Collectors.toMap(SpaceAssetDTO::getAssetChecksum, c -> c));
    }

    /**
     * get token' count map.
     *
     * @param addTokens    OI token
     * @param removeTokens OD token
     * @return map
     */
    private Map<String, AssetCiteDto> calTokenCount(List<SpaceAssetOpRo.OpAssetRo> addTokens,
                                                    List<SpaceAssetOpRo.OpAssetRo> removeTokens) {
        Map<String, AssetCiteDto> tokenCountMap = new HashMap<>();
        addTokens.forEach(
            item -> tokenCountMap.put(item.getToken(), AssetCiteDto.builder().name(item.getName())
                .cite(tokenCountMap.getOrDefault(item.getToken(), new AssetCiteDto()).getCite() + 1)
                .build()));
        removeTokens.forEach(
            item -> tokenCountMap.put(item.getToken(), AssetCiteDto.builder().name(item.getName())
                .cite(tokenCountMap.getOrDefault(item.getToken(), new AssetCiteDto()).getCite() - 1)
                .build()));
        return tokenCountMap;
    }


    @Data
    @Builder(toBuilder = true)
    @AllArgsConstructor
    @NoArgsConstructor
    static class AssetCiteDto {

        /**
         * asset name.
         */
        private String name;

        /**
         * citations.
         */
        private int cite;
    }

}
