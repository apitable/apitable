package com.vikadata.api.workspace.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.workspace.dto.NodeDescParseDTO;
import com.vikadata.entity.NodeDescEntity;

public interface INodeDescService extends IService<NodeDescEntity> {

    /**
     * @param nodeId node id
     * @param desc   node description
     */
    void edit(String nodeId, String desc);

    /**
     * copy node description
     *
     * @param newNodeMap original node id - new created node id map
     */
    void copyBatch(Map<String, String> newNodeMap);

    /**
     * @param nodeIds node id
     * @return map
     */
    Map<String, String> getNodeIdToDescMap(List<String> nodeIds);

    /**
     * @param nodeDescList node descption
     */
    void insertBatch(List<NodeDescEntity> nodeDescList);

    /**
     * desc of parsing node
     *
     * @param destDstId node id
     * @return NodeDescParseDTO
     */
    NodeDescParseDTO parseNodeDescByNodeId(String destDstId);
}
