package com.vikadata.api.control.request;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlRoleDict;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.control.role.ControlRole;
import com.vikadata.api.control.role.ControlRoleManager;
import com.vikadata.api.control.role.RoleConstants.Field;
import com.vikadata.api.modular.control.mapper.ControlMapper;
import com.vikadata.api.modular.control.mapper.ControlRoleMapper;
import com.vikadata.api.modular.control.model.ControlUnitDTO;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.entity.ControlRoleEntity;

/**
 * <p>
 * field control executor
 * </p>
 *
 * @author Chambers
 */
public class FieldControlRequest extends AbstractControlRequest {

    private final List<Long> units;

    private final List<String> controlIds;

    public FieldControlRequest(List<Long> units, List<String> controlIds) {
        this.units = units;
        this.controlIds = controlIds;
    }

    @Override
    public List<Long> getUnits() {
        return this.units;
    }

    @Override
    public List<String> getControlIds() {
        return this.controlIds;
    }

    @Override
    public ControlType getType() {
        return ControlType.DATASHEET_FIELD;
    }

    @Override
    public ControlRoleDict execute() {
        ControlRoleDict roleDict = ControlRoleDict.create();
        // Load Control Owner List
        List<ControlUnitDTO> controlUnitDTOList = SpringContextHolder.getBean(ControlMapper.class).selectOwnerControlUnitDTO(controlIds);
        if (!controlUnitDTOList.isEmpty()) {
            ControlRole role = ControlRoleManager.parseNodeRole(Field.EDITOR);
            controlUnitDTOList.stream().filter(dto -> units.contains(dto.getUnitId()))
                    .forEach(dto -> {
                        String controlId = dto.getControlId();
                        roleDict.put(controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1), role);
                        controlIds.remove(controlId);
                    });
        }
        if (controlIds.isEmpty()) {
            return roleDict;
        }
        // Get field role list
        List<ControlRoleEntity> controlEntities = SpringContextHolder.getBean(ControlRoleMapper.class).selectByControlIds(controlIds);
        Map<String, List<ControlRoleEntity>> controlIdMap = controlEntities.stream()
                .collect(Collectors.groupingBy(ControlRoleEntity::getControlId, Collectors.toList()));
        // each field has different permissions, group by control id
        for (Entry<String, List<ControlRoleEntity>> e : controlIdMap.entrySet()) {
            String controlId = e.getKey();
            List<String> roleCodes = e.getValue().stream()
                    .filter(controlRole -> units.contains(controlRole.getUnitId()))
                    .map(ControlRoleEntity::getRoleCode).collect(Collectors.toList());
            if (roleCodes.isEmpty()) {
                continue;
            }
            ControlRole role = ControlRoleManager.getTopFieldRole(roleCodes);
            roleDict.put(controlId.substring(controlId.indexOf(ControlIdBuilder.SYMBOL) + 1), role);
        }
        return roleDict;
    }
}
