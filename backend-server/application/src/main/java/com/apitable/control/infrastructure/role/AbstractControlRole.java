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

package com.apitable.control.infrastructure.role;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.ObjectUtil;
import com.apitable.control.infrastructure.ExportLevelEnum;
import com.apitable.control.infrastructure.permission.NodePermission;
import com.apitable.control.infrastructure.permission.PermissionDefinition;
import com.apitable.space.vo.SpaceGlobalFeature;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * base control role.
 *
 * @author Shawn Deng
 */
abstract class AbstractControlRole implements ControlRole {

    protected volatile Set<PermissionDefinition> permissions = new LinkedHashSet<>();

    private final boolean inherit;

    public AbstractControlRole(boolean inherit) {
        this.inherit = inherit;
    }

    @Override
    public boolean isInherit() {
        return this.inherit;
    }

    @Override
    public Set<PermissionDefinition> getPermissions() {
        return this.permissions;
    }

    @Override
    public Map<Integer, Long> getGroupPermissionBit() {
        Map<Integer, List<PermissionDefinition>> mapGroups = permissions.stream().distinct()
            .sorted(Comparator.comparing(PermissionDefinition::getGroup))
            .collect(Collectors.groupingBy(PermissionDefinition::getGroup, Collectors.toList()));
        return mapGroups.entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey,
                entry ->
                    entry.getValue().stream()
                        .mapToLong(PermissionDefinition::getValue)
                        .reduce(0L, (left, right) -> left | right)));
    }

    @Override
    public boolean hasPermission(PermissionDefinition permission) {
        int group = permission.getGroup();
        long value = permission.getValue();
        return !((getGroupPermissionBit().get(group) & value) == 0);
    }

    @Override
    public long getBits() {
        return getGroupPermissionBit().values().stream().reduce(0L, (left, right) -> left | right);
    }

    @Override
    public int compareTo(ControlRole other) {
        return Long.compare(getBits(), other.getBits());
    }

    @Override
    public boolean isEqualTo(ControlRole other) {
        return this.compareTo(other) == 0;
    }

    @Override
    public boolean isGreaterThan(ControlRole other) {
        return this.compareTo(other) > 0;
    }

    @Override
    public boolean isGreaterThanOrEqualTo(ControlRole other) {
        return this.compareTo(other) >= 0;
    }

    @Override
    public boolean isLessThan(ControlRole other) {
        return this.compareTo(other) < 0;
    }

    @Override
    public boolean isLessThanOrEqualTo(ControlRole other) {
        return this.compareTo(other) <= 0;
    }

    @Override
    public <T> T permissionToBean(Class<T> beanClass) {
        Map<String, Boolean> map = getPermissions().stream()
            .collect(HashMap::new, (m, v) -> m.put(v.getCode(), true), HashMap::putAll);
        return BeanUtil.toBeanIgnoreError(map, beanClass);
    }

    @Override
    public <T> T permissionToBean(Class<T> beanClass, SpaceGlobalFeature feature) {
        Map<String, Boolean> map = getPermissions().stream()
            .collect(HashMap::new, (m, v) -> m.put(v.getCode(), true), HashMap::putAll);
        // For non-main admin, node export permissions are determined by the space global properties
        if (getPermissions().contains(NodePermission.EXPORT_NODE) && !isAdmin()) {
            // Comparison of space global attributes and individual permissions
            boolean isAllowedNodeExportResult = isAllowedNodeExport(feature);
            map.put(NodePermission.EXPORT_NODE.getCode(), isAllowedNodeExportResult);
        }
        return BeanUtil.toBeanIgnoreError(map, beanClass);
    }

    private boolean isAllowedNodeExport(SpaceGlobalFeature feature) {
        Integer exportLevel = feature.exportLevelOrDefault();
        // Whether to allow node export
        boolean isDisallowedNodeExport = ObjectUtil.isNotNull(feature)
            && ExportLevelEnum.LEVEL_CLOSED.getValue().equals(exportLevel);
        if (ObjectUtil.isNull(feature) || isDisallowedNodeExport) {
            return false;
        }
        // Comparison of role permissions and personal permissions exported by nodes.
        String roleCode = ExportLevelEnum.toEnum(exportLevel).getRoleCode();
        ControlRole nodeExportPermission = ControlRoleManager.parseNodeRole(roleCode);
        return this.isGreaterThanOrEqualTo(nodeExportPermission);
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
