package com.vikadata.api.modular.workspace.service;

import com.vikadata.define.enums.NodeType;
import com.vikadata.schema.NodeRecentlyBrowsedSchema;

/**
 * <p>
 * workbench - recently opened node service class
 * </p>
 */
public interface INodeRecentlyBrowsedService {
    /**
     * update or insert a new record
     *
     * @param memberId member id
     * @param spaceId  space id
     * @param nodeId   nodeId
     * @param nodeType node type
     * @author zoe zheng
     * @date 2022/9/6 16:49
     */
    void saveOrUpdate(Long memberId, String spaceId, String nodeId, NodeType nodeType);

    /**
     * get mongo document by member id and node type
     *
     * @param memberId member id
     * @param nodeType node type
     * @return NodeRecentlyBrowsedEntity
     * @author zoe zheng
     * @date 2022/9/6 17:01
     */
    NodeRecentlyBrowsedSchema getByMemberIdAndNodeType(Long memberId, NodeType nodeType);

    /**
     * create a node recently browsed record
     *
     * @param memberId member id
     * @param spaceId  space id
     * @param nodeId   nodeId
     * @param nodeType node type
     * @author zoe zheng
     * @date 2022/9/6 17:04
     */
    void saveMemberBrowsedNodeId(Long memberId, String spaceId, String nodeId, NodeType nodeType);

}