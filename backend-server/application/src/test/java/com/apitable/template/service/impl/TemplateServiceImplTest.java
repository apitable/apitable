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

package com.apitable.template.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willReturn;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.core.exception.BusinessException;
import com.apitable.shared.cache.service.TemplateConfigCacheService;
import com.apitable.template.dto.TemplateDto;
import com.apitable.template.enums.TemplateException;
import com.apitable.template.mapper.TemplateMapper;
import com.apitable.template.vo.TemplateDirectoryVo;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.service.IDatasheetService;
import com.apitable.workspace.service.IFieldRoleService;
import com.apitable.workspace.service.INodeRelService;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.FieldPermissionInfo;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;

@Disabled("no assert")
public class TemplateServiceImplTest extends AbstractIntegrationTest {

    @MockBean
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

    @MockBean
    private TemplateConfigCacheService templateConfigCacheService;

    private final static String CATEGORIES_LIST_CONFIG =
        "[{\"templateIds\":[\"tpl1\",\"tpl2\"],\"categoryCode\":\"pc1\",\"categoryName\":\"cn1\"},"
            +
            "{\"templateIds\":[\"tpl3\",\"tpl4\"],\"categoryCode\":\"pc2\",\"categoryName\":\"cn2\"}]";

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
            .given(templateConfigCacheService)
            .getCategoriesListConfigCacheByLang(lang);
        TemplateDirectoryVo directory =
            templateService.getDirectoryVo("pc1", templateId, false, lang);
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
        } catch (BusinessException e) {
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
        } catch (BusinessException e) {
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
        } catch (BusinessException e) {
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
        given(
            iDatasheetService.getForeignFieldNames(Collections.singletonList("dst123"))).willReturn(
            foreignDstMap);
        // when
        boolean isException = false;
        try {
            templateService.checkDatasheetTemplate(CollUtil.newArrayList("dst123"), true,
                TemplateException.NODE_LINK_FOREIGN_NODE);
        } catch (BusinessException e) {
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
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 3,
                TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE);
        } catch (BusinessException e) {
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
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 3,
                TemplateException.FOLDER_FORM_LINK_FOREIGN_NODE);
        } catch (BusinessException e) {
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
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 5,
                TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE);
        } catch (BusinessException e) {
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
            templateService.checkFormOrMirrorIsForeignNode(subNodeIds, nodeTypeToNodeIdsMap, 5,
                TemplateException.FOLDER_MIRROR_LINK_FOREIGN_NODE);
        } catch (BusinessException e) {
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
        given(iFieldRoleService.getFieldPermissionMap(member, nodeId, null)).willReturn(
            fieldPermissionMap);
        // when
        try {
            templateService.checkFieldPermission(member, nodeId);
        } catch (BusinessException e) {
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
        given(iFieldRoleService.getFieldPermissionMap(member, nodeId, null)).willReturn(
            fieldPermissionMap);
        // when
        try {
            templateService.checkFieldPermission(member, nodeId);
        } catch (BusinessException e) {
            isException = true;
        }
        // then
        Assertions.assertTrue(isException);
    }

    @Test
    @Disabled
    void testGetNodeIdsByTemplateId() {
        // query un exist template
        assertThrows(BusinessException.class,
            () -> templateService.getNodeIdsByTemplateId("no_exist"));

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
