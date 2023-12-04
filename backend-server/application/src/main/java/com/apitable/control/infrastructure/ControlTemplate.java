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

package com.apitable.control.infrastructure;

import static com.apitable.workspace.enums.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.apitable.workspace.enums.PermissionException.NODE_ACCESS_DENIED;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.control.infrastructure.ControlIdBuilder.ControlId;
import com.apitable.control.infrastructure.PrincipalBuilder.Principal;
import com.apitable.control.infrastructure.exception.UnknownControlTypeException;
import com.apitable.control.infrastructure.exception.UnknownPrincipalTypeException;
import com.apitable.control.infrastructure.permission.FieldPermission;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.request.ControlRequest;
import com.apitable.control.infrastructure.request.ControlRequestFactory;
import com.apitable.control.infrastructure.request.FieldControlRequestFactory;
import com.apitable.control.infrastructure.request.NodeControlRequest;
import com.apitable.control.infrastructure.request.NodeControlRequestFactory;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.control.infrastructure.role.FieldEditorRole;
import com.apitable.control.infrastructure.role.NodeManagerRole;
import com.apitable.core.exception.BusinessException;
import com.apitable.organization.entity.UnitEntity;
import com.apitable.organization.enums.UnitType;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.service.ITeamService;
import com.apitable.organization.service.IUnitService;
import com.apitable.space.service.ISpaceRoleService;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * control template.
 *
 * @author Shawn Deng
 */
@Slf4j
@Component
public class ControlTemplate {

    @Resource
    private IUnitService iUnitService;

    @Resource
    private ITeamService iTeamService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ISpaceRoleService iSpaceRoleService;

    private final List<ControlRequestFactory> factories = new ArrayList<>();

    public ControlTemplate() {
        this.factories.add(new NodeControlRequestFactory());
        this.factories.add(new FieldControlRequestFactory());
    }

    public List<ControlRequestFactory> getFactories() {
        return factories;
    }

    /**
     * fetch node role.
     *
     * @param memberId member id
     * @param nodeId   node id
     * @return control role
     */
    public ControlRole fetchNodeRole(Long memberId, String nodeId) {
        ControlRoleDict controlRoleDict =
            execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeId(nodeId));
        if (controlRoleDict.isEmpty()) {
            throw new BusinessException(NODE_ACCESS_DENIED);
        }
        return controlRoleDict.get(nodeId);
    }

    public ControlRoleDict fetchNodeRole(Long memberId, List<String> nodeIds) {
        return execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeIds(nodeIds));
    }

    public ControlRoleDict fetchNodeRoleByTeamId(Long teamId, List<String> nodeIds) {
        return execute(PrincipalBuilder.teamId(teamId), ControlIdBuilder.nodeIds(nodeIds));
    }

    public ControlRoleDict fetchNodeTreeNode(Long memberId, List<String> nodeIds) {
        return execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeIds(nodeIds),
            ControlRequestOption.create().setNodeTreeRoleBuilding(true));
    }

    /**
     * fetch node role.
     *
     * @param memberId member id
     * @param nodeIds  node id list
     * @return control role dict
     */
    public ControlRoleDict fetchShareNodeTree(Long memberId, List<String> nodeIds) {
        return execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeIds(nodeIds),
            ControlRequestOption.create().setNodeTreeRoleBuilding(true)
                .setShareNodeTreeRoleBuilding(true));
    }

    public ControlRoleDict fetchRubbishNodeRole(Long memberId, List<String> nodeIds) {
        return execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeIds(nodeIds),
            ControlRequestOption.create().setRubbishRoleBuilding(true));
    }

    public ControlRoleDict fetchInternalNodeRole(Long memberId, List<String> nodeIds) {
        return execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeIds(nodeIds),
            ControlRequestOption.create().setInternalBuilding(true));
    }

    public void checkNodePermission(Long memberId, String nodeId, NodePermission permission,
                                    Consumer<Boolean> consumer) {
        ControlRole controlRole = fetchNodeRole(memberId, nodeId);
        consumer.accept(controlRole.hasPermission(permission));
    }

    /**
     * Determine whether the member has the specified permission on the node.
     *
     * @param memberId   member ID
     * @param nodeId     node ID
     * @param permission node permission
     * @return true | false
     */
    public boolean hasNodePermission(Long memberId, String nodeId, NodePermission permission) {
        ControlRoleDict controlRoleDict =
            execute(PrincipalBuilder.memberId(memberId), ControlIdBuilder.nodeId(nodeId));
        if (controlRoleDict.isEmpty()) {
            return false;
        }
        ControlRole controlRole = controlRoleDict.get(nodeId);
        return controlRole.hasPermission(permission);
    }

    public ControlRoleDict fetchNodeRoleByUnitId(Long unitId, String nodeId) {
        return execute(PrincipalBuilder.unitId(unitId), ControlIdBuilder.nodeId(nodeId));
    }

    /**
     * fetch field role.
     *
     * @param memberId    member id
     * @param datasheetId datasheet id
     * @param fieldId     field id
     * @return control role
     */
    public ControlRole fetchFieldRole(Long memberId, String datasheetId, String fieldId) {
        ControlRoleDict controlRoleDict = execute(PrincipalBuilder.memberId(memberId),
            ControlIdBuilder.fieldId(datasheetId, fieldId));
        if (controlRoleDict.isEmpty()) {
            throw new BusinessException(NODE_ACCESS_DENIED);
        }
        return controlRoleDict.get(fieldId);
    }

    public ControlRoleDict fetchFieldRole(Long memberId, String datasheetId,
                                          List<String> fieldIds) {
        return execute(PrincipalBuilder.memberId(memberId),
            ControlIdBuilder.fieldIds(datasheetId, fieldIds));
    }

    public void checkFieldPermission(Long memberId, String datasheetId, String fieldId,
                                     FieldPermission permission, Consumer<Boolean> consumer) {
        ControlRole controlRole = fetchFieldRole(memberId, datasheetId, fieldId);
        consumer.accept(controlRole.hasPermission(permission));
    }

    private static class DefaultControlRequestWrapper implements ControlRequestWrapper {

        private final ControlRequestOption requestOption;

        public DefaultControlRequestWrapper(ControlRequestOption requestOption) {
            this.requestOption = requestOption;
        }

        @Override
        public void doWrapper(ControlRequest request) {
            if (this.requestOption != null) {
                if (request instanceof NodeControlRequest) {
                    ((NodeControlRequest) request).setTreeBuilding(
                        this.requestOption.nodeTreeRoleBuilding);
                    ((NodeControlRequest) request).setShareTreeBuilding(
                        this.requestOption.shareNodeTreeRoleBuilding);
                    ((NodeControlRequest) request).setRubbishBuilding(
                        this.requestOption.rubbishRoleBuilding);
                    ((NodeControlRequest) request).setInternalBuilding(
                        this.requestOption.internalBuilding);
                }
            }
        }
    }

    protected ControlRoleDict execute(Principal principal, ControlId controlId) {
        return execute(principal, controlId,
            ControlRequestOption.create().setNodeTreeRoleBuilding(false));
    }

    protected ControlRoleDict execute(Principal principal, ControlId controlId,
                                      ControlRequestOption requestOption) {
        return doExecute(principal, controlId, new DefaultControlRequestWrapper(requestOption));
    }

    protected ControlRoleDict doExecute(Principal principal, ControlId controlId,
                                        ControlRequestWrapper requestWrapper) {
        if (principal.getPrincipalType() == PrincipalType.UNIT_ID) {
            UnitEntity unitEntity = iUnitService.getById(principal.getPrincipal());
            if (unitEntity.getUnitType().equals(UnitType.MEMBER.getType())) {
                return this.doExecute(PrincipalBuilder.memberId(unitEntity.getUnitRefId()),
                    controlId, requestWrapper);
            } else if (unitEntity.getUnitType().equals(UnitType.TEAM.getType())) {
                return this.doExecute(PrincipalBuilder.teamId(unitEntity.getUnitRefId()), controlId,
                    requestWrapper);
            }
            return this.doExecute(PrincipalBuilder.roleId(unitEntity.getUnitRefId()), controlId,
                requestWrapper);
        } else if (principal.getPrincipalType() == PrincipalType.MEMBER_ID) {
            // Check if main admin only if principal is member
            if (isWorkbenchAdmin(principal.getPrincipal())) {
                ControlRoleDict controlRoleDict = ControlRoleDict.create();
                ControlRole topRole = this.getTopRole(controlId.getControlType());
                controlId.toRealIdList().forEach(id -> controlRoleDict.put(id, topRole));
                return controlRoleDict;
            }
            // Query members, their departments, and the organizational units corresponding to their roles
            List<Long> fromUnitIds = iMemberService.getUnitsByMember(principal.getPrincipal());
            return doExecute(fromUnitIds, controlId, requestWrapper);
        } else if (principal.getPrincipalType() == PrincipalType.TEAM_ID) {
            // Query the organizational unit of a department and all parent departments and roles
            List<Long> fromUnitIds = iTeamService.getUnitsByTeam(principal.getPrincipal());
            return doExecute(fromUnitIds, controlId, requestWrapper);
        } else if (principal.getPrincipalType() == PrincipalType.ROLE_ID) {
            List<Long> unitIds =
                iUnitService.getUnitIdsByRefIds(CollUtil.newArrayList(principal.getPrincipal()));
            return doExecute(unitIds, controlId, requestWrapper);
        } else {
            throw new UnknownPrincipalTypeException(principal.getPrincipalType());
        }
    }

    protected ControlRoleDict doExecute(List<Long> principalFromUnitIds, ControlId controlId,
                                        ControlRequestWrapper requestWrapper) {
        ControlRequest request = createRequest(principalFromUnitIds, controlId);
        if (requestWrapper != null) {
            requestWrapper.doWrapper(request);
        }
        return request.execute();
    }

    private boolean isWorkbenchAdmin(Long memberId) {
        String spaceId = iMemberService.getSpaceIdByMemberId(memberId);
        if (StrUtil.isBlank(spaceId)) {
            throw new BusinessException(MEMBER_NOT_IN_SPACE);
        }
        List<Long> admins = iSpaceRoleService.getSpaceAdminsWithWorkbenchManage(spaceId);
        return admins.contains(memberId);
    }

    private ControlRole getTopRole(ControlType controlType) {
        switch (controlType) {
            case NODE:
                return new NodeManagerRole(true, true);
            case DATASHEET_FIELD:
                return new FieldEditorRole(true, true);
            default:
                return null;
        }
    }

    protected ControlRequest createRequest(List<Long> units, ControlId controlId) {
        for (ControlRequestFactory factory : getFactories()) {
            if (factory.getControlType().equals(controlId.getControlType())) {
                return factory.create(units, controlId.getControlIds());
            }
        }
        // Unknown control type
        throw new UnknownControlTypeException(controlId.getControlType());
    }
}
