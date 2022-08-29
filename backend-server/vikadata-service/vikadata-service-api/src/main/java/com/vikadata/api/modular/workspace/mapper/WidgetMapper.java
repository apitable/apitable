package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.vikadata.api.modular.workspace.model.NodeWidgetDto;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.widget.WidgetBaseInfo;
import com.vikadata.api.model.dto.widget.WidgetDTO;
import com.vikadata.api.model.vo.widget.WidgetInfo;
import com.vikadata.entity.WidgetEntity;

/**
 * <p>
 * 工作台-组件表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/12/23
 */
public interface WidgetMapper {

    /**
     * 查询组件的数量
     *
     * @param spaceId   空间ID
     * @param widgetIds 组件ID 列表
     * @return count
     * @author Chambers
     * @date 2020/12/23
     */
    Integer selectCountBySpaceIdAndWidgetIds(@Param("spaceId") String spaceId, @Param("list") List<String> widgetIds);

    /**
     * 查询基本信息
     *
     * @param widgetIds 组件ID 列表
     * @return WidgetBaseInfos
     * @author Chambers
     * @date 2020/12/23
     */
    List<WidgetBaseInfo> selectWidgetBaseInfoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * 查询组件信息
     *
     * @param spaceId   空间ID
     * @param nodeType  节点类型
     * @return WidgetInfo
     * @author Chambers
     * @date 2021/1/11
     */
    List<WidgetInfo> selectInfoBySpaceIdAndNodeType(@Param("spaceId") String spaceId, @Param("nodeType") Integer nodeType);

    /**
     * 查询组件信息
     *
     * @param nodeId 节点ID
     * @return WidgetBaseInfos
     * @author Chambers
     * @date 2021/1/11
     */
    List<WidgetInfo> selectInfoByNodeId(@Param("nodeId") String nodeId);

    /**
     * 批量查询节点组件信息
     *
     * @param nodeIds 节点ID集合
     * @return NodeWidgetDto
     * @author liuzijing
     * @date 2022/7/28
     */
    List<NodeWidgetDto> selectNodeWidgetDtoByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查询组件和数据源数表信息
     *
     * @param widgetIds 组件ID 列表
     * @return WidgetDTO
     * @author Chambers
     * @date 2021/1/29
     */
    List<WidgetDTO> selectWidgetDtoByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * 查询空间ID
     *
     * @param widgetIds 组件ID 集合
     * @return spaceIds
     * @author Chambers
     * @date 2021/1/25
     */
    List<String> selectSpaceIdByWidgetIds(@Param("list") Collection<String> widgetIds);

    /**
     * 查询指定节点下的所有组件ID
     *
     * @param nodeId 节点ID
     * @return WidgetIds
     * @author Chambers
     * @date 2020/12/23
     */
    List<String> selectWidgetIdsByNodeId(@Param("nodeId") String nodeId);

    /**
     * 查询指定节点下的组件，引用的数据源数表集合
     *
     * @param nodeIds 节点ID 集合
     * @return 数表ID 集合
     * @author Chambers
     * @date 2021/1/13
     */
    List<String> selectDataSourceDstIdsByNodeIds(@Param("nodeIds") List<String> nodeIds);

    /**
     * 查询指定节点下的组件数量
     *
     * @param nodeId 节点ID
     * @return count
     * @author Chambers
     * @date 2021/1/11
     */
    Integer selectCountByNodeId(@Param("nodeId") String nodeId);

    /**
     * 批量新增组件
     *
     * @param entities 实体列表
     * @return 执行结果数
     * @author Chambers
     * @date 2020/12/23
     */
    int insertBatch(@Param("entities") List<WidgetEntity> entities);

    /**
     * 根据组件ID获取所在空间ID
     *
     * @param widgetId 组件ID
     * @return 空间ID
     * @author Pengap
     * @date 2022/6/30 18:22:47
     */
    String selectSpaceIdByWidgetIdIncludeDeleted(@Param("widgetId") String widgetId);
}
