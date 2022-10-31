package com.vikadata.scheduler.space.service.impl;

import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.imageio.ImageIO;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.core.util.SqlTool;
import com.vikadata.define.enums.NodeType;
import com.vikadata.define.utils.DigestUtil;
import com.vikadata.define.utils.InputStreamCache;
import com.vikadata.define.utils.MimeTypeMapping;
import com.vikadata.entity.AssetEntity;
import com.vikadata.entity.SpaceAssetEntity;
import com.vikadata.integration.oss.OssClientTemplate;
import com.vikadata.integration.oss.OssObject;
import com.vikadata.scheduler.space.cache.service.RedisService;
import com.vikadata.scheduler.space.config.properties.ConfigProperties;
import com.vikadata.scheduler.space.mapper.asset.AssetMapper;
import com.vikadata.scheduler.space.mapper.space.SpaceAssetMapper;
import com.vikadata.scheduler.space.mapper.space.SpaceMapper;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetMetaMapper;
import com.vikadata.scheduler.space.mapper.workspace.DatasheetRecordMapper;
import com.vikadata.scheduler.space.mapper.workspace.NodeMapper;
import com.vikadata.scheduler.space.model.AssetDto;
import com.vikadata.scheduler.space.model.DataSheetMetaDto;
import com.vikadata.scheduler.space.model.DataSheetRecordDto;
import com.vikadata.scheduler.space.model.NodeDto;
import com.vikadata.scheduler.space.model.SpaceAssetDto;
import com.vikadata.scheduler.space.model.SpaceAssetKeyDto;
import com.vikadata.scheduler.space.service.ISpaceAssetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Space Asset Service Implement Class
 * </p>
 */
@Service
public class SpaceAssetServiceImpl implements ISpaceAssetService {

    @Resource
    private SpaceMapper spaceMapper;

    @Resource
    private SpaceAssetMapper spaceAssetMapper;

    @Resource
    private AssetMapper assetMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Resource
    private DatasheetRecordMapper datasheetRecordMapper;

    @Resource
    private RedisService redisService;

    @Autowired(required = false)
    private OssClientTemplate ossTemplate;

    @Resource
    private ConfigProperties configProperties;

    @Override
    public void referenceCounting(String spaceId) {
        XxlJobHelper.log("Space asset reference count statistics. Now: {}", LocalDateTime.now(ZoneId.of("+8")));
        List<String> nodeIds;
        Map<String, String> nodIdToSpcIdMap = MapUtil.newHashMap();
        if (StrUtil.isNotBlank(spaceId)) {
            // Determine if space exists
            int count = SqlTool.retCount(spaceMapper.countBySpaceId(spaceId, null));
            if (count > 0) {
                // Get all numbers in this space
                nodeIds = nodeMapper.selectNodeIdBySpaceIds(Collections.singletonList(spaceId), NodeType.DATASHEET.getNodeType());
                nodeIds.forEach(nodeId -> nodIdToSpcIdMap.put(nodeId, spaceId));
            }
            else {
                XxlJobHelper.log("Space「{}」 does not exist.", spaceId);
                return;
            }
        }
        else {
            // Get the data table whose data has changed in the past day and has not been deleted
            Long yesterdayMaxChangeId = redisService.getYesterdayMaxChangeId();
            List<NodeDto> nodeDtoList = nodeMapper.findChangedNodeIds(yesterdayMaxChangeId);
            nodeDtoList.forEach(nodeDto -> nodIdToSpcIdMap.put(nodeDto.getNodeId(), nodeDto.getSpaceId()));
            nodeIds = nodeDtoList.stream().map(NodeDto::getNodeId).collect(Collectors.toList());
        }
        if (CollUtil.isEmpty(nodeIds)) {
            XxlJobHelper.log("No table of numbers to count.");
            return;
        }
        // Find out the number table with the attachment field,
        // and form a Map of the number table ID-attachment field ID list
        Map<String, List<String>> dstIdToFldIdsMap = this.findAttachFieldIds(nodeIds);
        if (MapUtil.isEmpty(dstIdToFldIdsMap)) {
            XxlJobHelper.log("The statistics table has no attachment field.");
            return;
        }
        // Count the number of citations of each attachment in the data table.
        // If the number of references is inconsistent with the original record,
        // it is a Map of the number of references-spatial attachment resource ID list.
        Map<Integer, List<Long>> citeToSpcAssetIdsMap = MapUtil.newHashMap();
        Set<String> dstIds = dstIdToFldIdsMap.keySet();
        List<DataSheetRecordDto> recordDtoList = new ArrayList<>();
        List<SpaceAssetDto> spaceAssetDtoList = new ArrayList<>();
        // Batch query
        double size = 10.0;
        for (int i = 0; i < Math.ceil(dstIds.size() / size); i++) {
            List<String> split = dstIds.stream().skip((long) (i * size)).limit((long) size).collect(Collectors.toList());
            recordDtoList.addAll(datasheetRecordMapper.selectDtoByNodeIds(split));
            spaceAssetDtoList.addAll(spaceAssetMapper.selectDtoByNodeIds(split));
        }
        if (CollUtil.isNotEmpty(recordDtoList)) {
            // Count the number of citations to get the result set that needs to be changed and added
            List<SpaceAssetDto> needCreateList = new ArrayList<>();
            // Count citations, record changes and new result sets
            this.statistic(recordDtoList, spaceAssetDtoList, dstIdToFldIdsMap, citeToSpcAssetIdsMap, needCreateList);
            // Added previously unrecorded space attachment resources
            this.addRecord(needCreateList, nodIdToSpcIdMap);
        }
        else {
            // There is no data table record, and the reference times of space attachment resources are all set to 0
            List<Long> ids = spaceAssetDtoList.stream().filter(dto -> dto.getCite() != null && dto.getCite() != 0)
                    .map(SpaceAssetDto::getId).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(ids)) {
                citeToSpcAssetIdsMap.put(0, ids);
            }
        }
        if (MapUtil.isNotEmpty(citeToSpcAssetIdsMap)) {
            XxlJobHelper.log("No data to update.");
        }
        // Batch modify the number of space attachment resource references
        citeToSpcAssetIdsMap.forEach((key, value) -> spaceAssetMapper.updateCiteByIds(value, key));
        XxlJobHelper.log("Update completed.");
    }

    /**
     * Get a Map of Table ID-Attachment Field ID list
     */
    private Map<String, List<String>> findAttachFieldIds(List<String> nodeIds) {
        Map<String, List<String>> dstIdFieldIdsMap = MapUtil.newHashMap();
        List<DataSheetMetaDto> metaDtoList = new ArrayList<>(nodeIds.size());
        // Batch query
        double size = 10.0;
        for (int i = 0; i < Math.ceil(nodeIds.size() / size); i++) {
            List<String> split = nodeIds.stream().skip((long) (i * size)).limit((long) size).collect(Collectors.toList());
            metaDtoList.addAll(datasheetMetaMapper.selectDtoByNodeIds(split));
        }
        int attachFieldType = 6;
        for (DataSheetMetaDto meta : metaDtoList) {
            List<String> filedIds = new ArrayList<>();
            Object fieldMap = JSONUtil.parseObj(meta.getMetaData()).get("fieldMap");
            if (fieldMap == null) {
                continue;
            }
            JSONUtil.parseObj(fieldMap).values().forEach(value -> {
                JSONObject field = JSONUtil.parseObj(value);
                Object fieldType = field.get("type");
                if (fieldType != null && fieldType.equals(attachFieldType)) {
                    filedIds.add(field.get("id").toString());
                }
            });
            if (CollUtil.isNotEmpty(filedIds)) {
                dstIdFieldIdsMap.put(meta.getDstId(), filedIds);
            }
        }
        return dstIdFieldIdsMap;
    }

    /**
     * Count citations, record changes and new result sets
     */
    private void statistic(List<DataSheetRecordDto> recordDtoList, List<SpaceAssetDto> spaceAssetDtoList,
            Map<String, List<String>> dstIdToFldIdsMap, Map<Integer, List<Long>> citeToSpcAssetIdsMap, List<SpaceAssetDto> needCreateList) {
        Map<SpaceAssetKeyDto, SpaceAssetDto> originCiteMap = new HashMap<>(spaceAssetDtoList.size());
        spaceAssetDtoList.forEach(dto -> originCiteMap.put(new SpaceAssetKeyDto(dto.getNodeId(), dto.getFileUrl()), dto));
        // Traverse the record data of the number table
        for (DataSheetRecordDto recordDto : recordDtoList) {
            Map<String, Integer> tokenToCiteMap = MapUtil.newHashMap();
            String dstId = recordDto.getDstId();
            List<String> attachFieldIds = dstIdToFldIdsMap.get(dstId);
            // Iterate over the data in the attachment cells in each row
            recordDto.getDataList().forEach(data -> {
                JSONObject rowData = JSONUtil.parseObj(data);
                for (String fieldId : attachFieldIds) {
                    Object cellData = rowData.get(fieldId);
                    if (cellData == null) {
                        continue;
                    }
                    if (!JSONUtil.isJsonArray(cellData.toString())) {
                        XxlJobHelper.log("Datasheet「{}」 - Field「{}」.The cell has bad data. {}", dstId, fieldId, cellData);
                        continue;
                    }
                    JSONArray val = JSONUtil.parseArray(cellData);
                    if (val.size() == 0) {
                        continue;
                    }
                    if (!JSONUtil.isJsonObj(val.get(0).toString())) {
                        XxlJobHelper.log("Datasheet「{}」 - Field「{}」.The cell has bad data. {}", dstId, fieldId, cellData);
                        continue;
                    }
                    val.jsonIter().forEach(attach -> {
                        Object token = attach.get("token");
                        if (token != null) {
                            tokenToCiteMap.merge(token.toString(), 1, Integer::sum);
                        }
                    });
                }
            });
            if (MapUtil.isEmpty(tokenToCiteMap)) {
                continue;
            }
            // Record changes and new result sets
            tokenToCiteMap.forEach((token, cite) -> {
                SpaceAssetKeyDto keyDto = new SpaceAssetKeyDto(dstId, token);
                SpaceAssetDto spaceAssetDto = originCiteMap.get(keyDto);
                originCiteMap.remove(keyDto);
                if (spaceAssetDto != null) {
                    // Space attachment resources that need to be changed to record the number of references
                    if (!cite.equals(spaceAssetDto.getCite())) {
                        List<Long> list = citeToSpcAssetIdsMap.get(cite);
                        if (CollUtil.isNotEmpty(list)) {
                            list.add(spaceAssetDto.getId());
                            citeToSpcAssetIdsMap.put(cite, list);
                        }
                        else {
                            citeToSpcAssetIdsMap.put(cite, CollUtil.newArrayList(spaceAssetDto.getId()));
                        }
                    }
                }
                else {
                    // Add a space attachment resource that does not exist in the original record
                    SpaceAssetDto dto = SpaceAssetDto.builder().nodeId(dstId).fileUrl(token).cite(cite).build();
                    needCreateList.add(dto);
                }
            });
        }
        if (MapUtil.isEmpty(originCiteMap)) {
            return;
        }
        // If no citations are found in the original record, the citation counts are all set to 0
        List<Long> ids = originCiteMap.values().stream()
                .filter(dto -> dto.getCite() != null && dto.getCite() != 0).map(SpaceAssetDto::getId).collect(Collectors.toList());
        if (CollUtil.isEmpty(ids)) {
            return;
        }
        List<Long> list = citeToSpcAssetIdsMap.get(0);
        if (CollUtil.isNotEmpty(list)) {
            list.addAll(ids);
            citeToSpcAssetIdsMap.put(0, list);
        }
        else {
            citeToSpcAssetIdsMap.put(0, ids);
        }
    }

    /**
     * Added previously unrecorded space attachment resources
     */
    private void addRecord(List<SpaceAssetDto> needCreateList, Map<String, String> nodIdToSpcIdMap) {
        if (CollUtil.isEmpty(needCreateList)) {
            return;
        }
        // Information that matches the underlying attachment resource
        List<String> tokenList = needCreateList.stream().map(SpaceAssetDto::getFileUrl).collect(Collectors.toList());
        List<AssetDto> assetDtoList = assetMapper.selectDtoByTokens(tokenList);
        Map<String, AssetDto> assetDtoMap = assetDtoList.stream().collect(Collectors.toMap(AssetDto::getFileUrl, dto -> dto));
        List<SpaceAssetEntity> insertList = new ArrayList<>();
        for (SpaceAssetDto dto : needCreateList) {
            AssetDto assetDto = assetDtoMap.get(dto.getFileUrl());
            if (assetDto == null) {
                XxlJobHelper.log("Resource「{}」 not found.", dto.getFileUrl());
                // Pull from the cloud, add basic attachment records
                assetDto = this.getObjectFromCloud(dto.getFileUrl());
                if (assetDto == null) {
                    XxlJobHelper.log("The resource「{}」 does not exist in the cloud.", dto.getFileUrl());
                    continue;
                }
                assetDtoMap.put(dto.getFileUrl(), assetDto);
            }
            SpaceAssetEntity entity = SpaceAssetEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(nodIdToSpcIdMap.get(dto.getNodeId()))
                    .nodeId(dto.getNodeId())
                    .assetId(assetDto.getId())
                    .assetChecksum(assetDto.getChecksum())
                    .cite(dto.getCite())
                    .type(NodeType.DATASHEET.getNodeType())
                    .fileSize(assetDto.getFileSize())
                    .build();
            insertList.add(entity);
        }
        if (CollUtil.isNotEmpty(insertList)) {
            spaceAssetMapper.insertList(insertList);
            XxlJobHelper.log("Add complete.");
        }
    }

    /**
     * Pull resource attachments from the cloud
     */
    private AssetDto getObjectFromCloud(String path) {
        OssObject object = ossTemplate.getObject(configProperties.getOssBucketName(), path);
        if (object == null) {
            return null;
        }
        AssetEntity entity = AssetEntity.builder()
                .id(IdWorker.getId())
                .checksum(object.getContentDigest())
                .bucket(configProperties.getOssType())
                .fileUrl(path)
                .fileSize(object.getContentLength().intValue())
                .mimeType(object.getContentType())
                .build();

        try (InputStreamCache streamCache = new InputStreamCache(object.getInputStream(), object.getContentLength() <= 0 ? object.getInputStream().available() : object.getContentLength())) {
            if (StrUtil.isNotBlank(entity.getMimeType())) {
                entity.setExtensionName(MimeTypeMapping.mimeTypeToExtension(entity.getMimeType()));
            }
            // Cloud may not return md5, use InputStream to recalculate
            if (entity.getChecksum() == null) {
                entity.setChecksum(DigestUtil.md5Hex(streamCache.getInputStream()));
            }
            entity.setHeadSum(DigestUtil.createHeadSum(streamCache.getInputStream()));
            BufferedImage bi = ImageIO.read(streamCache.getInputStream());
            if (bi != null) {
                entity.setHeight(bi.getHeight());
                entity.setWidth(bi.getWidth());
            }
        }
        catch (Exception e) {
            XxlJobHelper.log("Error parsing cloud resource「{}」. Mes: {}", path, e.getMessage());
        }
        try {
            boolean flag = SqlHelper.retBool(assetMapper.insertEntity(entity));
            if (!flag) {
                XxlJobHelper.log("Failed to add base attachment record. Path: {}", path);
                return null;
            }
        }
        catch (Exception e) {
            XxlJobHelper.log("Failed to save base asset record「{}」. Msg: {}", path, e.getMessage());
            return null;
        }
        AssetDto asset = new AssetDto();
        asset.setId(entity.getId());
        asset.setChecksum(entity.getChecksum());
        asset.setFileSize(entity.getFileSize());
        return asset;
    }
}
