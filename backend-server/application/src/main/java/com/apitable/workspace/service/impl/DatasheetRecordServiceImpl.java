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

package com.apitable.workspace.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.shared.util.IdUtil;
import com.apitable.user.mapper.UserMapper;
import com.apitable.workspace.dto.DataSheetRecordDTO;
import com.apitable.workspace.dto.DataSheetRecordGroupDTO;
import com.apitable.workspace.dto.NodeCopyDTO;
import com.apitable.workspace.entity.DatasheetRecordEntity;
import com.apitable.workspace.mapper.DatasheetRecordMapper;
import com.apitable.workspace.model.Datasheet;
import com.apitable.workspace.ro.RecordMapRo;
import com.apitable.workspace.service.IDatasheetRecordService;
import com.apitable.workspace.vo.DatasheetRecordMapVo;
import com.apitable.workspace.vo.DatasheetRecordVo;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import jakarta.annotation.Resource;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * datasheet record service implements.
 */
@Slf4j
@Service
public class DatasheetRecordServiceImpl
    extends ServiceImpl<DatasheetRecordMapper, DatasheetRecordEntity>
    implements IDatasheetRecordService {

    @Resource
    private UserMapper userMapper;

    @Override
    public void batchSave(List<DatasheetRecordEntity> entities) {
        if (CollUtil.isEmpty(entities)) {
            return;
        }
        List<List<DatasheetRecordEntity>> splitList = CollUtil.split(entities, 1000);
        for (List<DatasheetRecordEntity> list : splitList) {
            baseMapper.insertBatch(list);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Datasheet.Records createRecords(Long userId, String dstId,
                                           Datasheet.Records records) {
        List<DatasheetRecordEntity> recordList = new ArrayList<>();
        records.forEach(record -> {
            String recordId = Optional.ofNullable(record.getId()).orElse(IdUtil.createRecordId());
            record.setId(recordId);
            DatasheetRecordEntity recordEntity = DatasheetRecordEntity.builder()
                .id(IdWorker.getId())
                .recordId(recordId)
                .data(record.getData().toJsonString())
                .dstId(dstId)
                .fieldUpdatedInfo(record.getFieldUpdatedInfo().toJsonString())
                .createdBy(userId)
                .updatedBy(userId)
                .build();
            recordList.add(recordEntity);
        });
        List<List<DatasheetRecordEntity>> split = CollUtil.split(recordList, 1000);
        for (List<DatasheetRecordEntity> entities : split) {
            baseMapper.insertBatch(entities);
        }
        return records;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveBatch(Long userId, JSONObject recordMap, String dstId) {
        List<DatasheetRecordEntity> recordList = new ArrayList<>();
        JSONObject recordMeta = this.getInitRecordMeta(userId);
        for (Map.Entry<String, Object> entry : recordMap.entrySet()) {
            RecordMapRo recordMapRo = BeanUtil.toBean(entry.getValue(), RecordMapRo.class);
            JSONObject fieldUpdatedMap = recordMapRo.getFieldUpdatedMap();
            if (fieldUpdatedMap != null && !fieldUpdatedMap.isEmpty()) {
                recordMeta.set("fieldUpdatedMap", fieldUpdatedMap);
            }
            DatasheetRecordEntity recordEntity = DatasheetRecordEntity.builder()
                .id(IdWorker.getId())
                .recordId(Optional.ofNullable(recordMapRo.getId()).orElse(IdUtil.createRecordId()))
                .data(StrUtil.isEmptyIfStr(recordMapRo.getData()) ? null :
                    StrUtil.toString(recordMapRo.getData()))
                .dstId(dstId)
                .createdBy(userId)
                .updatedBy(userId)
                .fieldUpdatedInfo(recordMeta.toString())
                .build();
            recordList.add(recordEntity);
        }
        List<List<DatasheetRecordEntity>> split = CollUtil.split(recordList, 1000);
        for (List<DatasheetRecordEntity> entities : split) {
            baseMapper.insertBatch(entities);
        }
    }

    @Override
    public void copyRecords(Long userId, String sourceDatasheetId, String targetDatasheetId,
                            NodeCopyDTO nodeCopyDTO,
                            boolean retain) {
        log.info("Copy records");
        List<DatasheetRecordVo> voList = baseMapper.selectListByDstId(sourceDatasheetId);
        if (CollUtil.isEmpty(voList)) {
            return;
        }

        Set<String> archivedRecordIds =
            baseMapper.selectArchivedRecordIdsByDstId(sourceDatasheetId);
        Set<String> delFieldIds = CollUtil.unionDistinct(nodeCopyDTO.getDelFieldIds(),
            nodeCopyDTO.getLinkFieldIds());
        List<String> autoNumberFieldIds = nodeCopyDTO.getAutoNumberFieldIds();
        JSONObject recordMeta = this.getInitRecordMeta(userId);
        List<DatasheetRecordEntity> list = new ArrayList<>(voList.size());
        voList.forEach(vo -> {
            if (archivedRecordIds.contains(vo.getId())) {
                return;
            }
            JSONObject data = vo.getData();
            // delete specified field data
            if (CollUtil.isNotEmpty(delFieldIds) && !data.isEmpty()) {
                data.keySet().removeIf(delFieldIds::contains);
            }
            DatasheetRecordEntity entity = new DatasheetRecordEntity();
            entity.setId(IdWorker.getId());
            entity.setDstId(targetDatasheetId);
            entity.setRecordId(vo.getId());
            entity.setData(StrUtil.toString(data));
            String fieldUpdatedInfo;
            if (retain) {
                fieldUpdatedInfo = vo.getRecordMeta();
            } else if (autoNumberFieldIds.isEmpty()) {
                fieldUpdatedInfo = recordMeta.toString();
            } else {
                // Keep the value of the self-increasing number without keeping all recordMeta.
                JSONObject fieldUpdatedMap =
                    this.copyFieldUpdatedMap(vo.getRecordMeta(), autoNumberFieldIds);
                fieldUpdatedInfo = recordMeta.set("fieldUpdatedMap", fieldUpdatedMap).toString();
            }
            entity.setFieldUpdatedInfo(fieldUpdatedInfo);
            entity.setCreatedBy(userId);
            entity.setUpdatedBy(userId);
            list.add(entity);
        });
        List<List<DatasheetRecordEntity>> split = CollUtil.split(list, 1000);
        for (List<DatasheetRecordEntity> entities : split) {
            baseMapper.insertBatch(entities);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void copyFieldData(String dstId, String sourceFieldId, String targetFieldId) {
        log.info("Copy data from a column to a new column");
        List<DataSheetRecordDTO> voList = baseMapper.selectDtoByDstId(dstId);
        List<DatasheetRecordEntity> list = new ArrayList<>();
        voList.forEach(vo -> {
            JSONObject data = vo.getData();
            Object fieldData = data.get(sourceFieldId);
            if (ObjectUtil.isNotNull(fieldData)) {
                data.set(targetFieldId, fieldData);
                DatasheetRecordEntity entity = DatasheetRecordEntity.builder()
                    .id(vo.getId()).data(StrUtil.toString(data)).build();
                list.add(entity);
            }
        });
        if (CollUtil.isNotEmpty(list)) {
            this.updateBatchById(list, list.size());
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DatasheetRecordMapVo delFieldData(String dstId, List<String> delFieldIds,
                                             boolean saveDb) {
        log.info("Deletes the data of the specified field in the datasheet record.");
        if (CollUtil.isNotEmpty(delFieldIds)) {
            List<DataSheetRecordDTO> voList = baseMapper.selectDtoByDstId(dstId);
            List<DatasheetRecordEntity> list = new ArrayList<>();
            Map<String, DatasheetRecordVo> map = MapUtil.newHashMap();
            voList.forEach(vo -> {
                JSONObject data = vo.getData();
                delFieldIds.forEach(data::remove);
                DatasheetRecordEntity entity = DatasheetRecordEntity.builder()
                    .id(vo.getId()).data(StrUtil.toString(data)).build();
                list.add(entity);
                map.put(vo.getRecordId(),
                    DatasheetRecordVo.builder().id(vo.getRecordId()).data(data).build());
            });
            if (saveDb) {
                this.updateBatchById(list, list.size());
            }
            return DatasheetRecordMapVo.builder().recordMap(JSONUtil.parseObj(map)).build();
        }
        return null;
    }

    @Override
    public List<DatasheetRecordMapVo> findMapByDstIds(Collection<String> dstIds) {
        log.info("Get the recordMap of multiple datasheet.");
        List<DatasheetRecordMapVo> recordMapVos = new ArrayList<>();
        List<DataSheetRecordGroupDTO> dtoList = new ArrayList<>();
        double size = 5.0;
        for (int i = 0; i < Math.ceil(dstIds.size() / size); i++) {
            List<String> split = dstIds.stream().skip((long) (i * size)).limit((long) size)
                .collect(Collectors.toList());
            dtoList.addAll(baseMapper.selectGroupDtoByDstIds(split));
        }
        if (CollUtil.isNotEmpty(dtoList)) {
            dtoList.forEach(dto -> {
                DatasheetRecordMapVo vo = this.processRecordMapVo(dto.getRecordVoList());
                vo.setDstId(dto.getDstId());
                recordMapVos.add(vo);
            });
        }
        return recordMapVos;
    }

    /**
     * processing records.
     */
    private DatasheetRecordMapVo processRecordMapVo(List<DatasheetRecordVo> list) {
        log.info("handle large records begin：{}", DateUtil.now());
        if (CollUtil.isEmpty(list)) {
            return new DatasheetRecordMapVo();
        }
        Map<String, DatasheetRecordVo> map = list.stream()
            .collect(Collectors.toMap(DatasheetRecordVo::getId, record -> record));
        JSONObject recordMap = JSONUtil.parseObj(map);
        log.info("handle large records end：{}", DateUtil.now());
        return DatasheetRecordMapVo.builder().recordMap(recordMap).build();
    }

    /**
     * gets the initialized record meta.
     */
    private JSONObject getInitRecordMeta(Long userId) {
        String uuid = userMapper.selectUuidById(userId);
        long createdAt = Instant.now(Clock.system(ZoneId.of("+8"))).toEpochMilli();
        JSONObject recordMeta = JSONUtil.createObj();
        recordMeta.set("createdAt", createdAt);
        recordMeta.set("createdBy", uuid);
        return recordMeta;
    }

    private JSONObject copyFieldUpdatedMap(String recordMeta, List<String> autoNumberFieldIds) {
        JSONObject fieldUpdatedMap = JSONUtil.createObj();
        JSONObject originFieldUpdatedMap =
            JSONUtil.parseObj(recordMeta).getJSONObject("fieldUpdatedMap");
        if (originFieldUpdatedMap == null) {
            return fieldUpdatedMap;
        }
        for (String fieldId : autoNumberFieldIds) {
            if (originFieldUpdatedMap.get(fieldId) == null) {
                continue;
            }
            fieldUpdatedMap.set(fieldId, originFieldUpdatedMap.get(fieldId));
        }
        return fieldUpdatedMap;
    }
}
