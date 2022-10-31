package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.vo.node.RubbishNodeVo;

public interface INodeRubbishService {

    /**
     * @param spaceId space id
     * @param memberId member id
     * @param size          expected load quantity（May be because the total number or permissions are not enough）
     * @param lastNodeId    id of the last node in the loaded list
     * @param isOverLimit   whether to request an overrun node
     * @return DeletedNodeVo
     */
    List<RubbishNodeVo> getRubbishNodeList(String spaceId, Long memberId, Integer size, String lastNodeId, Boolean isOverLimit);

    /**
     * Check whether the rubbish node exists and whether the members have permissions.
     *
     * @param spaceId space id
     * @param memberId member id
     * @param nodeId node id
     */
    void checkRubbishNode(String spaceId, Long memberId, String nodeId);

    /**
     * restore the node of the rubbish
     *
     * @param userId user id
     * @param nodeId   the id of the restored node
     * @param parentId parent node of recovery location
     */
    void recoverRubbishNode(Long userId, String nodeId, String parentId);

    /**
     * @param userId user id
     * @param nodeId the id of the cleared node
     */
    void delRubbishNode(Long userId, String nodeId);
}
