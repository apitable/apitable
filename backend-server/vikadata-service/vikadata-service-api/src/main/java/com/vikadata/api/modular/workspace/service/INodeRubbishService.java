package com.vikadata.api.modular.workspace.service;

import java.util.List;

import com.vikadata.api.model.vo.node.RubbishNodeVo;

/**
 * <p>
 * 工作台-节点回收舱 服务接口
 * </p>
 *
 * @author Chambers
 * @date 2021/9/14
 */
public interface INodeRubbishService {

    /**
     * 获取回收站的节点列表
     *
     * @param spaceId       空间ID
     * @param memberId      成员ID
     * @param size          期望加载数量（可能因为总数或权限不够数）
     * @param lastNodeId    已加载列表中最后一个节点的ID
     * @param isOverLimit   是否请求超限节点
     * @return DeletedNodeVo
     * @author Chambers
     * @date 2020/8/17
     */
    List<RubbishNodeVo> getRubbishNodeList(String spaceId, Long memberId, Integer size, String lastNodeId, Boolean isOverLimit);

    /**
     * 检查回收站节点是否存在、成员是否有权限
     *
     * @param spaceId  空间ID
     * @param memberId 成员ID
     * @param nodeId   节点ID
     * @author Chambers
     * @date 2020/8/29
     */
    void checkRubbishNode(String spaceId, Long memberId, String nodeId);

    /**
     * 恢复回收站的节点
     *
     * @param userId   用户ID
     * @param nodeId   恢复的节点ID
     * @param parentId 恢复位置的父节点
     * @author Chambers
     * @date 2020/8/29
     */
    void recoverRubbishNode(Long userId, String nodeId, String parentId);

    /**
     * 删除回收站的节点
     *
     * @param userId 用户ID
     * @param nodeId 清除的节点ID
     * @author Chambers
     * @date 2020/8/29
     */
    void delRubbishNode(Long userId, String nodeId);
}
