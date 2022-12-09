package com.vikadata.api.enterprise.control.infrastructure.role;

import org.junit.jupiter.api.Test;

import com.vikadata.api.control.infrastructure.ExportLevelEnum;
import com.vikadata.api.control.infrastructure.role.NodeEditorRole;
import com.vikadata.api.control.infrastructure.role.NodeManagerRole;
import com.vikadata.api.control.infrastructure.role.NodeReaderRole;
import com.vikadata.api.control.infrastructure.role.NodeRole;
import com.vikadata.api.control.infrastructure.role.NodeUpdaterRole;
import com.vikadata.api.space.vo.SpaceGlobalFeature;
import com.vikadata.api.workspace.vo.NodePermissionView;

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
