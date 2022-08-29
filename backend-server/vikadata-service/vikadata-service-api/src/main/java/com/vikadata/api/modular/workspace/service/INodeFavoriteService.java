package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.vo.node.FavoriteNodeInfo;

/**
 * <p>
 * 节点收藏表 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2020/9/1
 */
public interface INodeFavoriteService {

    /**
     * 获取星标节点ID列表
     *
     * @param memberId 成员ID
     * @return FavoriteNodeIds
     * @author Chambers
     * @date 2021/12/14s
     */
    List<String> getFavoriteNodeIdsByMemberId(Long memberId);

    /**
     * 获取收藏的节点列表
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @return 节点信息列表
     * @author Chambers
     * @date 2020/9/1
     */
    List<FavoriteNodeInfo> getFavoriteNodeList(String spaceId, Long memberId);

    /**
     * 移动收藏节点的位置
     *
     * @param memberId  成员ID
     * @param nodeId    节点ID
     * @param preNodeId 目标位置的前置节点
     * @author Chambers
     * @date 2020/9/1
     */
    void move(Long memberId, String nodeId, String preNodeId);

    /**
     * 更改节点的收藏状态
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @author Chambers
     * @date 2020/9/1
     */
    void updateFavoriteStatus(String spaceId, Long memberId, String nodeId);
}
