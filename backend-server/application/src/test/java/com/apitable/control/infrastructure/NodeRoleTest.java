/*
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

package com.apitable.control.infrastructure;

import org.junit.jupiter.api.Test;

import com.apitable.control.infrastructure.role.NodeEditorRole;
import com.apitable.control.infrastructure.role.NodeManagerRole;
import com.apitable.control.infrastructure.role.NodeReaderRole;
import com.apitable.control.infrastructure.role.NodeRole;
import com.apitable.control.infrastructure.role.NodeUpdaterRole;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.workspace.vo.NodePermissionView;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author tao
 */
public class NodeRoleTest {

    @Test
    void givenControlRoleWithoutExportNodePermissionWhenGetNodePermissionViewThenExportableIsNull() {
        NodeRole nodeRole = new NodeRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isNull();
    }

    @Test
    void givenControlRoleWithExportNodePermissionAndSpaceFeatureWithDisallowExportNodeWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeReaderRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_CLOSED.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenReaderRoleAndSpaceFeatureWithExportNodeLevelReadWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeReaderRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeReaderRoleAndSpaceFeatureWithExportNodeBeyondLevelUpdateWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeReaderRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_UPDATE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeReaderRoleAndSpaceFeatureWithExportNodeBeyondLevelEditWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeReaderRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeReaderRoleAndSpaceFeatureWithExportNodeBeyondLevelManageWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeReaderRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_MANAGE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeUpdaterRoleWithExportNodePermissionAndSpaceFeatureWithDisallowExportNodeWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeUpdaterRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_CLOSED.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeUpdaterRoleAndSpaceFeatureWithExportNodeLevelReadWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeUpdaterRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeUpdaterRoleAndSpaceFeatureWithExportNodeBeyondLevelUpdateWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeUpdaterRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_UPDATE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeUpdaterRoleAndSpaceFeatureWithExportNodeBeyondLevelEditWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeUpdaterRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeUpdaterRoleAndSpaceFeatureWithExportNodeBeyondLevelManageWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeUpdaterRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_MANAGE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeEditorRoleAndSpaceFeatureWithExportNodeLevelEditWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeEditorRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeEditorRoleAndSpaceFeatureWithExportNodeLevelReadWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeEditorRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeEditorRoleAndSpaceFeatureWithExportNodeLevelUpdateWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeEditorRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_UPDATE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeEditorRoleAndSpaceFeatureWithExportNodeLevelManageWhenGetNodePermissionViewThenExportableIsFalse() {
        NodeRole nodeRole = new NodeEditorRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_MANAGE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isFalse();
    }

    @Test
    void givenNodeManagerRoleAndSpaceFeatureWithExportNodeLevelReadWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeManagerRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_READ.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeManagerRoleAndSpaceFeatureWithExportNodeLevelUpdateWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeManagerRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_UPDATE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeManagerRoleAndSpaceFeatureWithExportNodeLevelEditWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeManagerRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_BEYOND_EDIT.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }

    @Test
    void givenNodeManagerRoleAndSpaceFeatureWithExportNodeLevelManageWhenGetNodePermissionViewThenExportableIsTrue() {
        NodeRole nodeRole = new NodeManagerRole();
        SpaceGlobalFeature spaceGlobalFeature = new SpaceGlobalFeature();
        spaceGlobalFeature.setExportLevel(ExportLevelEnum.LEVEL_MANAGE.getValue());
        NodePermissionView nodePermissionView = nodeRole.permissionToBean(NodePermissionView.class, spaceGlobalFeature);
        assertThat(nodePermissionView.getExportable()).isTrue();
    }
}
