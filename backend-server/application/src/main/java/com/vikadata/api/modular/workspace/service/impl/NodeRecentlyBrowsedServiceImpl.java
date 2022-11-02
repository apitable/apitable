package com.vikadata.api.modular.workspace.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.modular.workspace.repository.NodeRecentlyBrowsedRepository;
import com.vikadata.api.modular.workspace.service.INodeRecentlyBrowsedService;
import com.vikadata.api.enums.node.NodeType;
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
    private static final int RECENTLY_NODE_ID_LENGTH = 10;

    @Resource
    private NodeRecentlyBrowsedRepository nodeRecentlyBrowsedRepository;

    @Override
    public void saveOrUpdate(Long memberId, String spaceId, String nodeId, NodeType nodeType) {
        NodeRecentlyBrowsedSchema document = getByMemberIdAndNodeType(memberId, nodeType);
        if (null == document) {
            saveMemberBrowsedNodeId(memberId, spaceId, nodeId, nodeType);
            return;
        }
        // filter current node id
        List<String> nodeIds = document.getNodeIds().stream().filter(i -> !nodeId.equals(i)).collect(Collectors.toList());
        if (nodeIds.size() == RECENTLY_NODE_ID_LENGTH) {
            nodeIds.remove(0);
        }
        nodeIds.add(nodeId);
        document.setNodeIds(nodeIds);
        nodeRecentlyBrowsedRepository.save(document);
    }

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
