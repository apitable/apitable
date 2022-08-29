package com.vikadata.scheduler.space.service.impl;

import java.awt.image.BufferedImage;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
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
import com.vikadata.scheduler.space.model.SpaceAssetBaseDto;
import com.vikadata.scheduler.space.model.SpaceAssetDto;
import com.vikadata.scheduler.space.model.SpaceAssetKeyDto;
import com.vikadata.scheduler.space.service.ISpaceAssetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 * 空间-附件资源 服务实现类
 * </p>
 *
 * @author Chambers
 * @since 2020/4/16
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
        XxlJobHelper.log("空间附件资源引用计数统计,当前时间：{}", LocalDateTime.now(ZoneId.of("+8")));
        List<String> nodeIds;
        Map<String, String> nodIdToSpcIdMap = MapUtil.newHashMap();
        if (StrUtil.isNotBlank(spaceId)) {
            // 判断空间是否存在
            int count = SqlTool.retCount(spaceMapper.countBySpaceId(spaceId, null));
            if (count > 0) {
                // 获取该空间所有的数表
                nodeIds = nodeMapper.selectNodeIdBySpaceIds(Collections.singletonList(spaceId), NodeType.DATASHEET.getNodeType());
                nodeIds.forEach(nodeId -> nodIdToSpcIdMap.put(nodeId, spaceId));
            }
            else {
                XxlJobHelper.log("指定统计的空间：{} 不存在。", spaceId);
                return;
            }
        }
        else {
            // 获取过去一天发生数据变化，且未被删除的数表
            Long yesterdayMaxChangeId = redisService.getYesterdayMaxChangeId();
            List<NodeDto> nodeDtoList = nodeMapper.findChangedNodeIds(yesterdayMaxChangeId);
            nodeDtoList.forEach(nodeDto -> nodIdToSpcIdMap.put(nodeDto.getNodeId(), nodeDto.getSpaceId()));
            nodeIds = nodeDtoList.stream().map(NodeDto::getNodeId).collect(Collectors.toList());
        }
        if (CollUtil.isEmpty(nodeIds)) {
            XxlJobHelper.log("没有数表需要统计");
            return;
        }
        // 找出存在附件字段的数表，组成数表ID-附件字段ID列表的Map
        Map<String, List<String>> dstIdToFldIdsMap = this.findAttachFieldIds(nodeIds);
        if (MapUtil.isEmpty(dstIdToFldIdsMap)) {
            XxlJobHelper.log("统计的数表均无附件字段");
            return;
        }
        // 统计每个附件在数表中的引用次数，与原纪录次数不一致的，组成引用次数-空间附件资源ID列表的Map
        Map<Integer, List<Long>> citeToSpcAssetIdsMap = MapUtil.newHashMap();
        Set<String> dstIds = dstIdToFldIdsMap.keySet();
        List<DataSheetRecordDto> recordDtoList = new ArrayList<>();
        List<SpaceAssetDto> spaceAssetDtoList = new ArrayList<>();
        // 分批次查询
        double size = 10.0;
        for (int i = 0; i < Math.ceil(dstIds.size() / size); i++) {
            List<String> split = dstIds.stream().skip((long) (i * size)).limit((long) size).collect(Collectors.toList());
            recordDtoList.addAll(datasheetRecordMapper.selectDtoByNodeIds(split));
            spaceAssetDtoList.addAll(spaceAssetMapper.selectDtoByNodeIds(split));
        }
        if (CollUtil.isNotEmpty(recordDtoList)) {
            // 统计引用数，得到需要变更和新增的结果集
            List<SpaceAssetDto> needCreateList = new ArrayList<>();
            // 统计引用数，记录变更和新增的结果集
            this.statistic(recordDtoList, spaceAssetDtoList, dstIdToFldIdsMap, citeToSpcAssetIdsMap, needCreateList);
            // 新增原来未记录的空间附件资源
            this.addRecord(needCreateList, nodIdToSpcIdMap);
        }
        else {
            // 没有任何数表记录，空间附件资源的引用次数全部置为0
            List<Long> ids = spaceAssetDtoList.stream().filter(dto -> dto.getCite() != null && dto.getCite() != 0)
                    .map(SpaceAssetDto::getId).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(ids)) {
                citeToSpcAssetIdsMap.put(0, ids);
            }
        }
        if (MapUtil.isNotEmpty(citeToSpcAssetIdsMap)) {
            XxlJobHelper.log("没有数据需要更新");
        }
        // 批量修改空间附件资源引用数
        citeToSpcAssetIdsMap.forEach((key, value) -> spaceAssetMapper.updateCiteByIds(value, key));
        XxlJobHelper.log("更新完成");
    }

    @Override
    public void releaseAsset(String spaceId, LocalDateTime startAt, LocalDateTime endAt) {
        XxlJobHelper.log("资源修改参数,spaceId={},startAt={},endAt={}", spaceId, startAt, endAt);
        // TODO 扫描开发者上传表
        List<SpaceAssetBaseDto> dtoList = spaceAssetMapper.selectZeroCiteDtoBySpaceIdAndCreatedAt(spaceId, 2, startAt, endAt);
        if (CollUtil.isNotEmpty(dtoList)) {
            Map<Long, String> assetMap = dtoList.stream().collect(Collectors.toMap(SpaceAssetBaseDto::getId, SpaceAssetBaseDto::getChecksum));
            XxlJobHelper.log("需要删除数据,count={}", assetMap.size());
            batchRemoveAssetByIds(assetMap.keySet(), assetMap.values().stream().distinct().collect(Collectors.toList()));
            dtoList.forEach(dto -> {
                boolean result = ossTemplate.delete(configProperties.getOssBucketName(), dto.getFileUrl());
                if (!result) {
                    XxlJobHelper.log("七牛云删除资源失败={}", dto);
                }
            });
        }
    }

    /**
     * 批量删除附件，通过ID
     *
     * @param spaceAssetIds space_asset主键
     * @param checksums assets checksum
     */
    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void batchRemoveAssetByIds(Set<Long> spaceAssetIds, Collection<String> checksums) {
        spaceAssetMapper.updateIsDeletedByIds(spaceAssetIds);
        assetMapper.updateIsDeletedByChecksums(checksums);
    }


    /**
     * 获取数表ID-附件字段ID列表的Map
     */
    private Map<String, List<String>> findAttachFieldIds(List<String> nodeIds) {
        Map<String, List<String>> dstIdFieldIdsMap = MapUtil.newHashMap();
        List<DataSheetMetaDto> metaDtoList = new ArrayList<>(nodeIds.size());
        // 分批次查询
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
     * 统计引用数，记录变更和新增的结果集
     */
    private void statistic(List<DataSheetRecordDto> recordDtoList, List<SpaceAssetDto> spaceAssetDtoList,
            Map<String, List<String>> dstIdToFldIdsMap, Map<Integer, List<Long>> citeToSpcAssetIdsMap, List<SpaceAssetDto> needCreateList) {
        Map<SpaceAssetKeyDto, SpaceAssetDto> originCiteMap = new HashMap<>(spaceAssetDtoList.size());
        spaceAssetDtoList.forEach(dto -> originCiteMap.put(new SpaceAssetKeyDto(dto.getNodeId(), dto.getFileUrl()), dto));
        // 遍历数表的记录数据
        for (DataSheetRecordDto recordDto : recordDtoList) {
            Map<String, Integer> tokenToCiteMap = MapUtil.newHashMap();
            String dstId = recordDto.getDstId();
            List<String> attachFieldIds = dstIdToFldIdsMap.get(dstId);
            // 遍历每一行中附件单元格里的数据
            recordDto.getDataList().forEach(data -> {
                JSONObject rowData = JSONUtil.parseObj(data);
                for (String fieldId : attachFieldIds) {
                    Object cellData = rowData.get(fieldId);
                    if (cellData == null) {
                        continue;
                    }
                    if (!JSONUtil.isJsonArray(cellData.toString())) {
                        XxlJobHelper.log("数表：{} 字段：{} 单元格存在错误数据：{}", dstId, fieldId, cellData);
                        continue;
                    }
                    JSONArray val = JSONUtil.parseArray(cellData);
                    if (val.size() == 0) {
                        continue;
                    }
                    if (!JSONUtil.isJsonObj(val.get(0).toString())) {
                        XxlJobHelper.log("数表：{} 字段：{} 单元格存在错误数据：{}", dstId, fieldId, cellData);
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
            // 记录变更和新增的结果集
            tokenToCiteMap.forEach((token, cite) -> {
                SpaceAssetKeyDto keyDto = new SpaceAssetKeyDto(dstId, token);
                SpaceAssetDto spaceAssetDto = originCiteMap.get(keyDto);
                originCiteMap.remove(keyDto);
                if (spaceAssetDto != null) {
                    // 记录引用数需要变更的空间附件资源
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
                    // 新增原记录不存在的空间附件资源
                    SpaceAssetDto dto = SpaceAssetDto.builder().nodeId(dstId).fileUrl(token).cite(cite).build();
                    needCreateList.add(dto);
                }
            });
        }
        if (MapUtil.isEmpty(originCiteMap)) {
            return;
        }
        // 原纪录若找不到任何引用，引用次数全部置为0
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
     * 新增原来未记录的空间附件资源
     */
    private void addRecord(List<SpaceAssetDto> needCreateList, Map<String, String> nodIdToSpcIdMap) {
        if (CollUtil.isEmpty(needCreateList)) {
            return;
        }
        // 匹配基础附件资源的信息
        List<String> tokenList = needCreateList.stream().map(SpaceAssetDto::getFileUrl).collect(Collectors.toList());
        List<AssetDto> assetDtoList = assetMapper.selectDtoByTokens(tokenList);
        Map<String, AssetDto> assetDtoMap = assetDtoList.stream().collect(Collectors.toMap(AssetDto::getFileUrl, dto -> dto));
        List<SpaceAssetEntity> insertList = new ArrayList<>();
        for (SpaceAssetDto dto : needCreateList) {
            AssetDto assetDto = assetDtoMap.get(dto.getFileUrl());
            if (assetDto == null) {
                XxlJobHelper.log("资源找不到：{}", dto.getFileUrl());
                // 从云端拉取，新增基础附件记录
                assetDto = this.getObjectFromCloud(dto.getFileUrl());
                if (assetDto == null) {
                    XxlJobHelper.log("云端不存在该资源，path：{}", dto.getFileUrl());
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
            XxlJobHelper.log("新增完成");
        }
    }

    /**
     * 从云端拉取资源附件
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
            // 云端可能未返回 md5，使用 InputStream 重新计算
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
            XxlJobHelper.log("云端资源 {} 解析出错，msg:{}", path, e.getMessage());
        }
        try {
            // 新增基础附件记录
            boolean flag = SqlHelper.retBool(assetMapper.insertEntity(entity));
            if (!flag) {
                XxlJobHelper.log("新增基础附件记录失败，path：{}", path);
                return null;
            }
        }
        catch (Exception e) {
            XxlJobHelper.log("保存基础附件记录 {} 失败，msg:{}", path, e.getMessage());
            return null;
        }
        AssetDto asset = new AssetDto();
        asset.setId(entity.getId());
        asset.setChecksum(entity.getChecksum());
        asset.setFileSize(entity.getFileSize());
        return asset;
    }
}
