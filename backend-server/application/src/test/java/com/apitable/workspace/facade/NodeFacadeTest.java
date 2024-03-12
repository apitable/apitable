/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.facade;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.workspace.dto.NodeBaseInfoDTO;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.ro.NodeOpRo;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Node facade test.
 */
public class NodeFacadeTest extends AbstractIntegrationTest {

    @Autowired
    private NodeMapper nodeMapper;

    private DefaultCTENodeFacadeImpl defaultCTENodeFacade;

    private NonCTENodeFacadeImpl nonCTENodeFacade;

    @BeforeEach
    public void beforeMethod() {
        super.beforeMethod();
        this.defaultCTENodeFacade = new DefaultCTENodeFacadeImpl(nodeMapper);
        this.nonCTENodeFacade = new NonCTENodeFacadeImpl(nodeMapper);
    }

    @Test
    public void testContains() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long userId = userSpace.getUserId();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userId, spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userId, spaceId, op);
        String secondLevelFolderId2 = iNodeService.createNode(userId, spaceId, op);

        // default cte node facade implement class
        boolean status101 = defaultCTENodeFacade.contains(rootNodeId, secondLevelFolderId);
        assertThat(status101).isTrue();
        boolean status102 = defaultCTENodeFacade.contains(firstLevelFolderId, secondLevelFolderId);
        assertThat(status102).isTrue();
        boolean status103 = defaultCTENodeFacade.contains(secondLevelFolderId, secondLevelFolderId2);
        assertThat(status103).isFalse();
        boolean status104 = defaultCTENodeFacade.contains(firstLevelFolderId, "xxx");
        assertThat(status104).isFalse();

        // non cte node facade implement class
        boolean status201 = nonCTENodeFacade.contains(rootNodeId, secondLevelFolderId);
        assertThat(status201).isTrue();
        boolean status202 = nonCTENodeFacade.contains(firstLevelFolderId, secondLevelFolderId);
        assertThat(status202).isTrue();
        boolean status203 = nonCTENodeFacade.contains(secondLevelFolderId, secondLevelFolderId2);
        assertThat(status203).isFalse();
        boolean status204 = nonCTENodeFacade.contains(firstLevelFolderId, "xxx");
        assertThat(status204).isFalse();
    }

    @Test
    public void testGetParentPathNodes() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        Long userId = userSpace.getUserId();
        String spaceId = userSpace.getSpaceId();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        NodeOpRo op = new NodeOpRo().toBuilder()
            .parentId(rootNodeId)
            .type(NodeType.FOLDER.getNodeType())
            .nodeName("folder")
            .build();
        String firstLevelFolderId = iNodeService.createNode(userId, spaceId, op);
        // second level folder id
        op.setParentId(firstLevelFolderId);
        String secondLevelFolderId = iNodeService.createNode(userId, spaceId, op);
        List<String> nodeIds = CollUtil.newArrayList(secondLevelFolderId);
        // default cte node facade implement class
        List<NodeBaseInfoDTO> nodes101 =
            defaultCTENodeFacade.getParentPathNodes(nodeIds, true);
        assertThat(nodes101.size()).isEqualTo(3);
        List<NodeBaseInfoDTO> nodes102 =
            defaultCTENodeFacade.getParentPathNodes(nodeIds, false);
        assertThat(nodes102.size()).isEqualTo(2);
        // non cte node facade implement class
        List<NodeBaseInfoDTO> nodes201 =
            nonCTENodeFacade.getParentPathNodes(nodeIds, true);
        assertThat(nodes201.size()).isEqualTo(3);
        List<NodeBaseInfoDTO> nodes202 =
            nonCTENodeFacade.getParentPathNodes(nodeIds, false);
        assertThat(nodes202.size()).isEqualTo(2);
        nodeIds.add(firstLevelFolderId);
        List<NodeBaseInfoDTO> nodes203 =
            nonCTENodeFacade.getParentPathNodes(nodeIds, false);
        assertThat(nodes203.size()).isEqualTo(2);
    }
}
