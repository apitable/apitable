package com.vikadata.api.enterprise.control.infrastructure;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.api.enterprise.control.infrastructure.role.RoleConstants.Node;

/**
 * Export Level
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum ExportLevelEnum {

    LEVEL_CLOSED(0, StrUtil.EMPTY),

    LEVEL_BEYOND_READ(1, Node.READER),

    LEVEL_BEYOND_EDIT(2, Node.EDITOR),

    LEVEL_MANAGE(3, Node.MANAGER),

    LEVEL_BEYOND_UPDATE(4, Node.UPDATER);

    private final Integer value;

    private final String roleCode;

    public static ExportLevelEnum toEnum(int value) {
        for (ExportLevelEnum e : ExportLevelEnum.values()) {
            if (e.getValue() == value) {
                return e;
            }
        }
        throw new RuntimeException("unknown export type");
    }
}
