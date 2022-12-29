package com.vikadata.api.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.workspace.dto.NodeDescDTO;
import com.vikadata.entity.NodeDescEntity;

public interface NodeDescMapper extends BaseMapper<NodeDescEntity> {

    /**
     * @param nodeId node id
     * @return datasheet id
     */
    Long selectIdByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeId node id
     * @return the node's description
     */
    String selectDescriptionByNodeId(@Param("nodeId") String nodeId);

    /**
     * @param nodeIds node ids
     * @return node descriptions
     */
    List<NodeDescDTO> selectByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * @param nodeId node id
     * @param desc   description
     * @return affected rows
     */
    int updateDescByNodeId(@Param("nodeId") String nodeId, @Param("desc") String desc);

    /**
     * @param entities node descriptions
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeDescEntity> entities);
}
