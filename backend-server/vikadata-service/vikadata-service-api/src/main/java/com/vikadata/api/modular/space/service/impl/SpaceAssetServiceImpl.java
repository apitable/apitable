package com.vikadata.api.modular.space.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.service.SpaceCapacityCacheService;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.exception.DataSheetException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.dto.space.NodeAssetDto;
import com.vikadata.api.model.dto.space.SpaceAssetDto;
import com.vikadata.api.model.ro.space.SpaceAssetOpRo;
import com.vikadata.api.modular.base.mapper.AssetMapper;
import com.vikadata.api.modular.space.mapper.SpaceAssetMapper;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.AssetEntity;
import com.vikadata.entity.SpaceAssetEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 空间-附件表 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
@Slf4j
@Service
public class SpaceAssetServiceImpl extends ServiceImpl<SpaceAssetMapper, SpaceAssetEntity> implements ISpaceAssetService {

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private SpaceCapacityCacheService spaceCapacityCacheService;

    @Override
    public void saveEntities(List<SpaceAssetEntity> entities) {
        log.info("保存空间附件记录");
        boolean flag = SqlHelper.retBool(baseMapper.insertBatch(entities));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
        // 删除空间容量缓存
        spaceCapacityCacheService.del(entities.get(0).getSpaceId());
    }

    @Override
    public void saveAssetInSpace(String spaceId, String nodeId, Long assetId, String assetChecksum, AssetType assetType, String originalFileName, long fileSize) {
        log.info("新增空间附件记录");
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
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
    }

    @Override
    public void edit(Long id, Integer cite, Integer type) {
        log.info("编辑空间附件");
        SpaceAssetEntity entity = SpaceAssetEntity.builder().id(id).cite(cite).type(type).build();
        boolean flag = this.updateById(entity);
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    public void updateIsDeletedByNodeIds(List<String> nodeIds, Boolean isDel) {
        log.info("更改空间附件的逻辑删除状态");
        baseMapper.updateIsDeletedByNodeIds(nodeIds, isDel);
    }

    @Override
    public void copyBatch(Map<String, String> newNodeMap, String destSpaceId) {
        log.info("批量复制节点引用的空间附件资源");
        if (MapUtil.isNotEmpty(newNodeMap)) {
            List<NodeAssetDto> assetDtoList = baseMapper.selectNodeAssetDto(CollUtil.newArrayList(newNodeMap.keySet()));
            this.processNodeAssets(newNodeMap, destSpaceId, assetDtoList);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void processNodeAssets(Map<String, String> newNodeMap, String destSpaceId, List<NodeAssetDto> assetDtoList) {
        log.info("处理节点的空间附件资源");
        if (CollUtil.isNotEmpty(assetDtoList)) {
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
                        .isTemplate(asset.getIsTemplate())
                        .build();
                entities.add(entity);
            });
            this.saveEntities(entities);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void datasheetAttachmentCite(String spaceId, SpaceAssetOpRo opRo) {
        log.info("空间附件资源引用数变更");
        if (CollUtil.isEmpty(opRo.getAddToken()) && CollUtil.isEmpty(opRo.getRemoveToken())) {
            return;
        }
        String nodeId = opRo.getNodeId();
        // 统计token次数,转换成map，保证唯一性
        Map<String, AssetCiteDto> tokenCountMap = calTokenCount(opRo.getAddToken(), opRo.getRemoveToken());
        // 获取资源库中 token 已经存在的附件
        List<AssetEntity> baseAssets = assetMapper.selectByFileUrl(tokenCountMap.keySet());
        // 跨环境模版图片token不同但是checksum已经写入，或者未知来源的图片
        if (CollUtil.isEmpty(baseAssets)) {
            log.error("基础附件找不到:[{}]", tokenCountMap.keySet());
            return;
        }
        // 获取checksum用于查询空间附件资源
        List<Long> assetIds =
                baseAssets.stream().map(AssetEntity::getId).collect(Collectors.toList());
        // 获取空间数表附件
        Map<String, SpaceAssetDto> spaceAssetDtoMap =
                getSpaceAssetMapByAssetIdsAndType(spaceId, nodeId, AssetType.DATASHEET, assetIds);
        List<SpaceAssetEntity> addEntities = new ArrayList<>();
        List<SpaceAssetEntity> updateEntities = new ArrayList<>();
        List<Long> delSpaceAssetId = new ArrayList<>();
        // 统计写入和更新的entities
        baseAssets.forEach(item -> {
            // 需要修改
            if (spaceAssetDtoMap.containsKey(item.getChecksum())) {
                int cite =
                        spaceAssetDtoMap.get(item.getChecksum()).getCite() + tokenCountMap.get(item.getFileUrl()).getCite();
                Long id = spaceAssetDtoMap.get(item.getChecksum()).getId();
                // 收集引用数小于等于零的记录ID
                if (cite <= 0) {
                    delSpaceAssetId.add(id);
                } else {
                    updateEntities.add(
                            SpaceAssetEntity.builder().id(id).cite(cite).build());
                }
            }
            else {
                // 需要新增
                addEntities.add(SpaceAssetEntity.builder().id(IdWorker.getId()).spaceId(spaceId).nodeId(nodeId)
                        .assetId(item.getId()).cite(tokenCountMap.get(item.getFileUrl()).getCite())
                        .assetChecksum(item.getChecksum()).type(AssetType.DATASHEET.getValue())
                        .sourceName(tokenCountMap.get(item.getFileUrl()).getName()).fileSize(item.getFileSize())
                        .isTemplate(item.getIsTemplate()).build());
            }
        });
        boolean updateFlag = updateBatchById(updateEntities);
        ExceptionUtil.isTrue(updateFlag, DataSheetException.ATTACH_CITE_FAIL);
        boolean insertFlag = createBatch(addEntities);
        ExceptionUtil.isTrue(insertFlag, DataSheetException.ATTACH_CITE_FAIL);
        // 删除空间资源的引用记录（物理删除）
        if (delSpaceAssetId.size() > 0) {
            boolean flag = SqlHelper.retBool(baseMapper.deleteBatchByIds(delSpaceAssetId));
            ExceptionUtil.isTrue(flag, DataSheetException.ATTACH_CITE_FAIL);
        }
        // 删除空间容量缓存
        spaceCapacityCacheService.del(spaceId);
    }

    @Override
    public Map<String, SpaceAssetDto> getSpaceAssetMapByAssetIdsAndType(String spaceId, String nodeId,
            AssetType assetType, List<Long> assetIds) {
        List<SpaceAssetDto> spaceAssetDtoList =
                baseMapper.selectDtoByAssetIdsAndType(spaceId, nodeId, assetType.getValue(), assetIds);
        return spaceAssetDtoList.stream().collect(Collectors.toMap(SpaceAssetDto::getAssetChecksum, c -> c));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createBatch(List<SpaceAssetEntity> entities) {
        if (CollUtil.isNotEmpty(entities)) {
            return SqlHelper.retBool(baseMapper.insertBatch(entities));
        }
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateBatchById(List<SpaceAssetEntity> entities) {
        if (CollUtil.isNotEmpty(entities)) {
            return updateBatchById(entities, entities.size());
        }
        return true;
    }

    /**
     * 获取token次数map
     *
     * @param addTokens OI的token
     * @param removeTokens OD的token
     * @return Map<fileUrl, AssetCiteDto>
     * @author zoe zheng
     * @date 2020/12/24 3:19 下午
     */
    private Map<String, AssetCiteDto> calTokenCount(List<SpaceAssetOpRo.OpAssetRo> addTokens,
            List<SpaceAssetOpRo.OpAssetRo> removeTokens) {
        Map<String, AssetCiteDto> tokenCountMap = CollUtil.newHashMap();
        addTokens.forEach(item -> tokenCountMap.put(item.getToken(), AssetCiteDto.builder().name(item.getName())
                .cite(tokenCountMap.getOrDefault(item.getToken(), new AssetCiteDto()).getCite() + 1).build()));
        removeTokens.forEach(item -> tokenCountMap.put(item.getToken(), AssetCiteDto.builder().name(item.getName())
                .cite(tokenCountMap.getOrDefault(item.getToken(), new AssetCiteDto()).getCite() - 1).build()));
        return tokenCountMap;
    }


    @Data
    @Builder(toBuilder = true)
    @AllArgsConstructor
    @NoArgsConstructor
    static class AssetCiteDto {

        /**
         * 附件名称
         */
        private String name;

        /**
         * 引用次数
         */
        private int cite;
    }

}
