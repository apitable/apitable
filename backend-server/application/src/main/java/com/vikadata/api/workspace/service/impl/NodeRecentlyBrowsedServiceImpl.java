package com.vikadata.api.workspace.service.impl;

import java.util.Collections;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.workspace.repository.NodeRecentlyBrowsedRepository;
import com.vikadata.api.workspace.service.INodeRecentlyBrowsedService;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.schema.NodeRecentlyBrowsedSchema;

import org.springframework.stereotype.Service;

/**
 * <p>
 * Workbench - recently Viewed Nodes Service Implementation Class
 * </p>
 */
@Slf4j
@Service
public class NodeRecentlyBrowsedServiceImpl implements INodeRecentlyBrowsedService {

    @Resource
    private NodeRecentlyBrowsedRepository nodeRecentlyBrowsedRepository;

    @Override
    public NodeRecentlyBrowsedSchema getByMemberIdAndNodeType(Long memberId, NodeType nodeType) {
        return nodeRecentlyBrowsedRepository.findByMemberIdAndNodeType(memberId, nodeType.getNodeType());
    }

    @Override
    public void saveMemberBrowsedNodeId(Long memberId, String spaceId, String nodeId, NodeType nodeType) {
        NodeRecentlyBrowsedSchema document = NodeRecentlyBrowsedSchema.builder()
                .spaceId(spaceId)
                .memberId(memberId)
                .nodeType(nodeType.getNodeType())
                .nodeIds(Collections.singletonList(nodeId))
                .build();
        nodeRecentlyBrowsedRepository.insert(document);
    }

}
