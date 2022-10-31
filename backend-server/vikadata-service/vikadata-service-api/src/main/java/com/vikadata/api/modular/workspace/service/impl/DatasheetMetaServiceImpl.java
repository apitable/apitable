package com.vikadata.api.modular.workspace.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enums.exception.DataSheetException;
import com.vikadata.api.enums.exception.DatabaseException;
import com.vikadata.api.model.dto.datasheet.DatasheetMetaDTO;
import com.vikadata.api.model.ro.datasheet.MetaOpRo;
import com.vikadata.api.model.vo.datasheet.DatasheetMetaVo;
import com.vikadata.api.modular.workspace.mapper.DatasheetMetaMapper;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot;
import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.View;
import com.vikadata.api.modular.workspace.service.IDatasheetMetaService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.DatasheetMetaEntity;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.enums.exception.DataSheetException.FIELD_NOT_EXIST;

@Slf4j
@Service
public class DatasheetMetaServiceImpl implements IDatasheetMetaService {

    @Resource
    private DatasheetMetaMapper datasheetMetaMapper;

    @Override
    public void batchSave(List<DatasheetMetaEntity> metaEntities) {
        if (CollUtil.isEmpty(metaEntities)) {
            return;
        }
        datasheetMetaMapper.insertBatch(metaEntities);
    }

    @Override
    public DatasheetMetaVo findByDstId(String dstId) {
        log.info("Query the datasheet by ID");
        DatasheetMetaVo meta = datasheetMetaMapper.selectByNodeId(dstId);
        ExceptionUtil.isNotNull(meta, DatabaseException.QUERY_EMPTY_BY_ID);
        return meta;
    }

    @Override
    public List<DatasheetMetaDTO> findMetaDtoByDstIds(List<String> dstIds) {
        List<DatasheetMetaDTO> dtoList = new ArrayList<>();
        double size = 5.0;
        for (int i = 0; i < Math.ceil(dstIds.size() / size); i++) {
            List<String> split = dstIds.stream().skip((long) (i * size)).limit((long) size).collect(Collectors.toList());
            dtoList.addAll(datasheetMetaMapper.selectDtoByDstIds(split));
        }
        return dtoList;
    }

    @Override
    public void create(Long userId, String dstId, String metaData) {
        DatasheetMetaEntity metaEntity = DatasheetMetaEntity.builder()
                .id(IdWorker.getId())
                .dstId(dstId)
                .metaData(metaData)
                .revision(0L)
                .createdBy(userId)
                .updatedBy(userId)
                .build();
        boolean flag = SqlHelper.retBool(datasheetMetaMapper.insertMeta(metaEntity));
        ExceptionUtil.isTrue(flag, DatabaseException.INSERT_ERROR);
    }

    @Override
    public void edit(Long userId, String dstId, MetaOpRo meta) {
        ExceptionUtil.isNotNull(this.getMetaByDstId(dstId), DatabaseException.QUERY_EMPTY_BY_ID);
        boolean flag = SqlHelper.retBool(datasheetMetaMapper.updateByDstId(userId, StrUtil.toString(meta.getMeta()), dstId));
        ExceptionUtil.isTrue(flag, DatabaseException.EDIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void checkViewIfExist(String dstId, String viewId) {
        log.info("Check whether the specified view of the datasheet exists.，dstId:{},viewId:{}", dstId, viewId);
        DatasheetSnapshot snapshot = this.getMetaByDstId(dstId);
        ExceptionUtil.isNotNull(snapshot, DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotNull(snapshot.getMeta(), DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotEmpty(snapshot.getMeta().getViews(), DataSheetException.VIEW_NOT_EXIST);
        List<String> viewIds = snapshot.getMeta().getViews().stream().map(View::getId).collect(Collectors.toList());
        ExceptionUtil.isTrue(viewIds.contains(viewId), DataSheetException.VIEW_NOT_EXIST);
    }

    @Override
    public DatasheetSnapshot getMetaByDstId(String dstId) {
        return datasheetMetaMapper.selectByDstId(dstId);
    }

    @Override
    public void checkFieldIfExist(String dstId, String fieldId) {
        DatasheetSnapshot snapshot = getMetaByDstId(dstId);
        ExceptionUtil.isNotNull(snapshot, DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotNull(snapshot.getMeta(), DataSheetException.DATASHEET_NOT_EXIST);
        ExceptionUtil.isNotEmpty(snapshot.getMeta().getFieldMap(), DataSheetException.FIELD_NOT_EXIST);
        ExceptionUtil.isTrue(snapshot.getMeta().getFieldMap().containsKey(fieldId), FIELD_NOT_EXIST);
    }

    @Override
    public JSONObject getFieldPropertyByDstIdAndFieldName(String dstId, String fieldName) {
        DatasheetSnapshot dto = getMetaByDstId(dstId);
        for (String fieldId : dto.getMeta().getFieldMap().keySet()) {
            DatasheetSnapshot.Field field = dto.getMeta().getFieldMap().get(fieldId);
            if (field.getName().equals(fieldName)) {
                return field.getProperty();
            }
        }
        return null;
    }
}
