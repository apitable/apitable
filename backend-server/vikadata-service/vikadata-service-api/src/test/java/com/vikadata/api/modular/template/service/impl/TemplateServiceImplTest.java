package com.vikadata.api.modular.template.service.impl;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.cache.service.TemplateConfigService;
import com.vikadata.api.enums.exception.TemplateException;
import com.vikadata.api.model.dto.template.TemplateDto;
import com.vikadata.api.model.vo.node.FieldPermissionInfo;
import com.vikadata.api.model.vo.template.TemplateDirectoryVo;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.service.IDatasheetService;
import com.vikadata.api.modular.workspace.service.IFieldRoleService;
import com.vikadata.api.modular.workspace.service.INodeRelService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.define.enums.NodeType;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willReturn;

@Disabled("no assert")
public class TemplateServiceImplTest extends AbstractIntegrationTest {

    @SpyBean
    private TemplateMapper templateMapper;

    @MockBean
    private INodeService iNodeService;

    @Resource
    private TemplateServiceImpl templateService;

    @MockBean
    private IDatasheetService iDatasheetService;

    @MockBean
    private IFieldRoleService iFieldRoleService;

    @MockBean
    private INodeRelService iNodeRelService;

    @MockBean
    private NodeMapper nodeMapper;

    @SpyBean
    private TemplateConfigService templateConfigService;

    private final static String CATEGORIES_LIST_CONFIG =
            "[{\"templateIds\":[\"tpl1\",\"tpl2\"],\"categoryCode\":\"pc1\",\"categoryName\":\"cn1\"},"
                    + "{\"templateIds\":[\"tpl3\",\"tpl4\"],\"categoryCode\":\"pc2\",\"categoryName\":\"cn2\"}]";

    @Test
    void testGetDirectoryVo() {
        String templateId = "tpl1";
        String lang = "zh_CN";
        TemplateDto templateDto = new TemplateDto();
        templateDto.setType(NodeType.DATASHEET.getNodeType());
        willReturn(templateDto)
                .given(templateMapper)
                .selectDtoByTempId(templateId);
        willReturn(CATEGORIES_LIST_CONFIG)
                .given(templateConfigService)
                .getCategoriesListConfigCacheByLang(lang);
        TemplateDirectoryVo directory = templateService.getDirectoryVo("pc1", templateId, false, lang);
        assertThat(directory).isNotNull();
        assertThat(directory.getCategoryName()).isEqualTo("cn1");
    }

    @Test
    void testCheckTemplateForeignNodeThatIsFORM() {
        Long memberId = 123L;
        String nodeId = "dst123";
        boolean isException = false;
        // given
        given(iNodeService.getTypeByNodeId(nodeId)).willReturn(NodeType.FORM);
        // when
        try {
            templateService.checkTemplateForeignNode(memberId, nodeId);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckTemplateForeignNodeThatIsDashboard() {
        Long memberId = 123L;
        String nodeId = "dst123";
        boolean isException = false;
        // given
        given(iNodeService.getTypeByNodeId(nodeId)).willReturn(NodeType.DASHBOARD);
        // when
        try {
            templateService.checkTemplateForeignNode(memberId, nodeId);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckTemplateForeignNodeThatIsMirror() {
        Long memberId = 123L;
        String nodeId = "dst123";
        boolean isException = false;
        // given
        given(iNodeService.getTypeByNodeId(nodeId)).willReturn(NodeType.MIRROR);
        // when
        try {
            templateService.checkTemplateForeignNode(memberId, nodeId);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckDatasheetTemplate() {
        Map<String, List<String>> foreignDstMap = new HashMap<>();
        foreignDstMap.put("dst123", CollUtil.newArrayList("test filed"));
        // given
        given(iDatasheetService.getForeignFieldNames(Collections.singletonList("dst123"))).willReturn(foreignDstMap);
        // when
        boolean isException = false;
        try {
            templateService.checkDatasheetTemplate(CollUtil.newArrayList("dst123"), true, TemplateException.NODE_LINK_FOREIGN_NODE);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckFormIsForeignNode() {
        List<String> subNodeIds = CollUtil.newArrayList("dst1", "dst2");
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = new HashMap<>();
        List<String> datasheetList = CollUtil.newArrayList("dst1");
        List<String> formList = CollUtil.newArrayList("dst2");
        nodeTypeToNodeIdsMap.put(2, datasheetList);
        nodeTypeToNodeIdsMap.put(3, formList);
        Map<String, String> relNodeToMainNodeMap = new HashMap<>();
        relNodeToMainNodeMap.put("dst2", "dst");
        // given
        given(iNodeRelService.getRelNodeToMainNodeMap(formList)).willReturn(relNodeToMainNodeMap);
        given(nodeMapper.selectNodeNameByNodeId("dst2")).willReturn("test");
        // when
        boolean isException = false;
        try {
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 3, TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckFormIsForeignNodeWithoutDatasheet() {
        List<String> subNodeIds = CollUtil.newArrayList("dst1", "dst2");
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = new HashMap<>();
        List<String> mirrorList = CollUtil.newArrayList("dst1");
        List<String> formList = CollUtil.newArrayList("dst2");
        nodeTypeToNodeIdsMap.put(5, mirrorList);
        nodeTypeToNodeIdsMap.put(3, formList);
        // given
        given(nodeMapper.selectNodeNameByNodeId("dst2")).willReturn("test");
        // when
        boolean isException = false;
        try {
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 3, TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckMirrorIsForeignNode() {
        List<String> subNodeIds = CollUtil.newArrayList("dst1", "dst2");
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = new HashMap<>();
        List<String> datasheetList = CollUtil.newArrayList("dst1");
        List<String> mirrorList = CollUtil.newArrayList("dst2");
        nodeTypeToNodeIdsMap.put(2, datasheetList);
        nodeTypeToNodeIdsMap.put(5, mirrorList);
        Map<String, String> relNodeToMainNodeMap = new HashMap<>();
        relNodeToMainNodeMap.put("dst2", "dst");
        // given
        given(iNodeRelService.getRelNodeToMainNodeMap(mirrorList)).willReturn(relNodeToMainNodeMap);
        given(nodeMapper.selectNodeNameByNodeId("dst2")).willReturn("test");
        // when
        boolean isException = false;
        try {
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 5, TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckMirrorIsForeignNodeWithoutDatasheet() {
        List<String> subNodeIds = CollUtil.newArrayList("dst1", "dst2");
        Map<Integer, List<String>> nodeTypeToNodeIdsMap = new HashMap<>();
        List<String> mirrorList = CollUtil.newArrayList("dst1");
        List<String> formList = CollUtil.newArrayList("dst2");
        nodeTypeToNodeIdsMap.put(5, mirrorList);
        nodeTypeToNodeIdsMap.put(3, formList);
        // given
        given(nodeMapper.selectNodeNameByNodeId("dst2")).willReturn("test");
        // when
        boolean isException = false;
        try {
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 5, TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testCheckFieldPermissionWithoutException() {
        Long member = 123L;
        String nodeId = "dst123";
        FieldPermissionInfo fieldPermissionInfo = FieldPermissionInfo.builder()
                .fieldId("dst123")
                .hasRole(true)
                .build();
        boolean isException = false;
        Map<String, FieldPermissionInfo> fieldPermissionMap = new HashMap<>();
        fieldPermissionMap.put(nodeId, fieldPermissionInfo);
        // given
        given(iFieldRoleService.getFieldPermissionMap(member, nodeId, null)).willReturn(fieldPermissionMap);
        // when
        try {
            templateService.checkFieldPermission(member, nodeId);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertFalse(isException);
    }

    @Test
    void testCheckFieldPermissionWithException() {
        Long member = 123L;
        String nodeId = "dst123";
        FieldPermissionInfo fieldPermissionInfo = FieldPermissionInfo.builder()
                .fieldId("dst123")
                .hasRole(false)
                .build();
        boolean isException = false;
        Map<String, FieldPermissionInfo> fieldPermissionMap = new HashMap<>();
        fieldPermissionMap.put(nodeId, fieldPermissionInfo);
        // given
        given(iFieldRoleService.getFieldPermissionMap(member, nodeId, null)).willReturn(fieldPermissionMap);
        // when
        try {
            templateService.checkFieldPermission(member, nodeId);
        }
        catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    void testGetNodeIdsByTemplateId() {
        // query un exist template
        assertThrows(BusinessException.class, () -> templateService.getNodeIdsByTemplateId("no_exist"));

        // query a template with single node
        String singleNodeTemplateId = "tpl123";
        String nodeId = "dst123";
        willReturn(nodeId)
                .given(templateMapper)
                .selectNodeIdByTempId(singleNodeTemplateId);
        given(iNodeService.getTypeByNodeId(nodeId))
                .willReturn(NodeType.DATASHEET);
        List<String> templateNodeIds = templateService.getNodeIdsByTemplateId(singleNodeTemplateId);
        assertThat(templateNodeIds).isNotEmpty().hasSize(1);
    }
}
