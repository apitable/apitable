package com.vikadata.api.control.request;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
 * 字段控制单元请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/3/22
 */
public class FieldControlRequest extends AbstractControlRequest {

    private static final Logger log = LoggerFactory.getLogger(FieldControlRequest.class);

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
        log.info("获取字段权限");
        ControlRoleDict roleDict = ControlRoleDict.create();
        // 加载 owner
        List<ControlUnitDTO> controlUnitDTOList = SpringContextHolder.getBean(ControlMapper.class).selectOwnerControlUnitDTO(controlIds);
        // owner 列权限自动同步为可编辑
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
        // 获取字段角色集
        List<ControlRoleEntity> controlEntities = SpringContextHolder.getBean(ControlRoleMapper.class).selectByControlIds(controlIds);
        Map<String, List<ControlRoleEntity>> controlIdMap = controlEntities.stream()
                .collect(Collectors.groupingBy(ControlRoleEntity::getControlId, Collectors.toList()));
        // Unit在每个字段对应的多个权限
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
