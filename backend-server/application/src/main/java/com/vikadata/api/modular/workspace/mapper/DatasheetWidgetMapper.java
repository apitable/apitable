package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.DatasheetWidgetDTO;
import com.vikadata.entity.DatasheetWidgetEntity;

public interface DatasheetWidgetMapper extends BaseMapper<DatasheetWidgetEntity> {

    /**
     * @param widgetId widget id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity selectByWidgetId(@Param("widgetId") String widgetId);

    /**
     * @param dstId datasheet id
     * @return DatasheetWidgetEntity
     */
    DatasheetWidgetEntity selectByDstId(@Param("dstId") String dstId);

    /**
     * @param widgetIds widget ids
     * @return datasheetWidgetDTOs
     */
    List<DatasheetWidgetDTO> selectDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param entities datasheet's widgets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<DatasheetWidgetEntity> entities);
}
