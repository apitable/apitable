package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.vikadata.api.modular.workspace.model.NodeWidgetDto;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.WidgetBaseInfo;
import com.vikadata.api.model.dto.widget.WidgetDTO;
import com.vikadata.api.model.vo.widget.WidgetInfo;
import com.vikadata.entity.WidgetEntity;

public interface WidgetMapper {

    /**
     * query the number of components
     *
     * @param spaceId space id
     * @param widgetIds widget ids
     * @return count
     */
    Integer selectCountBySpaceIdAndWidgetIds(@Param("spaceId") String spaceId, @Param("list") List<String> widgetIds);

    /**
     * @param widgetIds widget ids
     * @return WidgetBaseInfos
     */
    List<WidgetBaseInfo> selectWidgetBaseInfoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param spaceId space id
     * @param nodeType  node type
     * @return WidgetInfo
     */
    List<WidgetInfo> selectInfoBySpaceIdAndNodeType(@Param("spaceId") String spaceId, @Param("nodeType") Integer nodeType);

    /**
     * @param nodeId node id
     * @return WidgetBaseInfos
     */
    List<WidgetInfo> selectInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return NodeWidgetDto
     */
    List<NodeWidgetDto> selectNodeWidgetDtoByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * query component and data source datasheet information
     *
     * @param widgetIds widget ids
     * @return WidgetDTO
     */
    List<WidgetDTO> selectWidgetDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param widgetIds widget ids
     * @return spaceIds
     */
    List<String> selectSpaceIdByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * @param nodeId node id
     * @return WidgetIds
     */
    List<String> selectWidgetIdsByNodeId(@Param("nodeId") String nodeId);

    /**
     * Query the components under the specified node, and the data source number table set referenced.
     *
     * @param nodeIds node ids
     * @return datasheet ids
     */
    List<String> selectDataSourceDstIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * @param entities widgets
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<WidgetEntity> entities);

    /**
     * @param widgetId widget id
     * @return space id
     */
    String selectSpaceIdByWidgetIdIncludeDeleted(@Param("widgetId") String widgetId);
}
