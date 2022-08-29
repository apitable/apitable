package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeDescDTO;
import com.vikadata.entity.NodeDescEntity;

/**
 * <p>
 * 工作台-节点描述表 Mapper 接口
 * </p>
 *
 * @author Shawn Deng
 * @since 2020-03-17
 */
public interface NodeDescMapper extends BaseMapper<NodeDescEntity> {

    /**
     * 获取表ID
     *
     * @param nodeId 节点ID
     * @return id
     * @author Chambers
     * @date 2020/3/18
     */
    Long selectIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * 获取节点描述
     *
     * @param nodeId 节点ID
     * @return description
     * @author Chambers
     * @date 2020/3/18
     */
    String selectDescriptionByNodeId(@Param("nodeId") String nodeId);

    /**
     * 批量查询
     *
     * @param nodeIds 节点ID列表
     * @return 实体列表
     * @author Chambers
     * @date 2020/5/9
     */
    List<NodeDescDTO> selectByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * 通过节点ID，修改描述
     *
     * @param nodeId 节点ID
     * @param desc   描述
     * @return 修改数
     * @author Chambers
     * @date 2020/5/21
     */
    int updateDescByNodeId(@Param("nodeId") String nodeId, @Param("desc") String desc);

    /**
     * 批量插入
     *
     * @param entities 实体
     * @return 执行结果
     * @author Chambers
     * @date 2020/5/26
     */
    int insertBatch(@Param("entities") List<NodeDescEntity> entities);
}
