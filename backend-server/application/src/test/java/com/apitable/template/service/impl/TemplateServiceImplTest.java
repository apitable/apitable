package com.apitable.template.service.impl;


import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.context.LoginContext;
import com.apitable.template.ro.CreateTemplateRo;
import com.apitable.template.vo.TemplateDirectoryVo;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.ro.NodeEmbedPageRo;
import com.apitable.workspace.ro.NodeOpRo;
import com.apitable.workspace.ro.NodeRelRo;
import com.apitable.workspace.vo.NodeShareTree;
import org.junit.jupiter.api.Test;

public class TemplateServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testCreateTplWithCustomPageInFolder() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        String folderId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(),
            NodeOpRo.builder().parentId(rootNodeId).type(
                NodeType.FOLDER.getNodeType()).build());
        // create custom page
        NodeRelRo nodeRelRo = new NodeRelRo();
        nodeRelRo.setEmbedPage(new NodeEmbedPageRo("https://www.baidu.con", "any"));
        iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(),
            NodeOpRo.builder().parentId(folderId).type(NodeType.CUSTOM_PAGE.getNodeType())
                .extra(nodeRelRo).build());
        CreateTemplateRo createTemplateRo = new CreateTemplateRo();
        createTemplateRo.setNodeId(folderId);
        createTemplateRo.setData(true);
        createTemplateRo.setName("new folder");
        String templateId = iTemplateService.create(userSpace.getUserId(), userSpace.getSpaceId(),
            createTemplateRo);
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        TemplateDirectoryVo vo =
            iTemplateService.getDirectoryVo("tpcprivate", templateId, true, lang);
        NodeShareTree nodeShareTree = vo.getNodeTree();
        assertThat(nodeShareTree.getChildrenNodes()).isNotEmpty();
        assertThat(nodeShareTree.getChildrenNodes().get(0).getExtra()).isNotEmpty();
    }

    @Test
    void testCreateTplWithCustomPageInFolderWithoutExtra() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(userSpace.getSpaceId());
        String folderId = iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(),
            NodeOpRo.builder().parentId(rootNodeId).type(
                NodeType.FOLDER.getNodeType()).build());

        iNodeService.createNode(userSpace.getUserId(), userSpace.getSpaceId(),
            NodeOpRo.builder().parentId(folderId).type(NodeType.CUSTOM_PAGE.getNodeType()).build());
        CreateTemplateRo createTemplateRo = new CreateTemplateRo();
        createTemplateRo.setNodeId(folderId);
        createTemplateRo.setData(true);
        createTemplateRo.setName("new folder");
        String templateId = iTemplateService.create(userSpace.getUserId(), userSpace.getSpaceId(),
            createTemplateRo);
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        TemplateDirectoryVo vo =
            iTemplateService.getDirectoryVo("tpcprivate", templateId, true, lang);
        NodeShareTree nodeShareTree = vo.getNodeTree();
        assertThat(nodeShareTree.getChildrenNodes()).isNotEmpty();
        assertThat(nodeShareTree.getChildrenNodes().get(0).getExtra()).isNull();
    }
}
