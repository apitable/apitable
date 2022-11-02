package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.node.NodeRelDTO;
import com.vikadata.entity.NodeRelEntity;

public interface NodeRelMapper extends BaseMapper<NodeRelEntity> {

    /**
     * @param relNodeIds associated node ids
     * @return MainNodeIds
     */
    List<String> selectMainNodeIdsByRelNodeIds(@Param("list") List<String> relNodeIds);

    /**
     * @param relNodeId rel node id
     * @return node rel
     */
    NodeRelEntity selectByRelNodeId(@Param("relNodeId") String relNodeId);

    /**
     * @param relNodeIds associated node ids
     * @return NodeRelEntity
     */
    List<NodeRelEntity> selectByRelNodeIds(@Param("list") Collection<String> relNodeIds);

    /**
     * @param mainNodeId main node id
     * @return BaseNodeInfo
     */
    List<NodeRelDTO> selectNodeRelDTO(@Param("mainNodeId") String mainNodeId);

    /**
     * add node association
     *
     * @param entities node rels
     * @return affected rows
     */
    int insertBatch(@Param("entities") List<NodeRelEntity> entities);
}
