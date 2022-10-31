package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.vo.node.FavoriteNodeInfo;

public interface INodeFavoriteService {

    /**
     * @param memberId member id
     * @return FavoriteNodeIds
     */
    List<String> getFavoriteNodeIdsByMemberId(Long memberId);

    /**
     * @param spaceId space id
     * @param memberId member id
     * @return FavoriteNodeInfos
     */
    List<FavoriteNodeInfo> getFavoriteNodeList(String spaceId, Long memberId);

    /**
     * move the location of the favorite node
     *
     * @param memberId member id
     * @param nodeId node id
     * @param preNodeId the front node of the target position
     */
    void move(Long memberId, String nodeId, String preNodeId);

    /**
     * change the favorite status of the node
     *
     * @param spaceId space id
     * @param memberId member id
     * @param nodeId node id
     */
    void updateFavoriteStatus(String spaceId, Long memberId, String nodeId);
}
