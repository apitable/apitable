package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.DatasheetWidgetDTO;
import com.vikadata.entity.DatasheetWidgetEntity;

/**
 * @author Shawn Deng
 * @date 2021-01-09 16:07:07
 */
public interface DatasheetWidgetMapper extends BaseMapper<DatasheetWidgetEntity> {

    /**
     * 根据组件ID查询
     *
     * @param widgetId 组件ID
     * @return DatasheetWidgetEntity
     * @author Shawn Deng
     * @date 2021/1/9 16:10
     */
    DatasheetWidgetEntity selectByWidgetId(@Param("widgetId") String widgetId);

    /**
     * 根据组件ID查询
     *
     * @param dstId 数表ID
     * @return DatasheetWidgetEntity
     * @author Shawn Deng
     * @date 2021/1/9 16:10
     */
    DatasheetWidgetEntity selectByDstId(@Param("dstId") String dstId);

    /**
     * 查询数表组件关联信息
     *
     * @param widgetIds 组件ID 列表
     * @return datasheetWidgetDTO List
     * @author Chambers
     * @date 2021/1/11
     */
    List<DatasheetWidgetDTO> selectDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * 批量新增组件
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2021/1/11
     */
    int insertBatch(@Param("entities") List<DatasheetWidgetEntity> entities);
}
