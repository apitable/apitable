package com.vikadata.api.enums.lang;

import cn.hutool.core.util.StrUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.api.control.role.RoleConstants.Node;

/**
 * 成员被允许导出维格表和视图的各权限枚举值。
 * @author tao
 */
@Getter
@AllArgsConstructor
public enum ExportLevelEnum {

    /**
     * 关闭 "closed"
     */
    LEVEL_CLOSED(0, StrUtil.EMPTY),

    /**
     * 只读及以上 "beyondReadable"
     */
    LEVEL_BEYOND_READ(1, Node.READER),

    /**
     * 可编辑以上 "beyondEditable"
     */
    LEVEL_BEYOND_EDIT(2, Node.EDITOR),

    /**
     * 管理 "manageable"
     */
    LEVEL_MANAGE(3, Node.MANAGER),

    /**
     * 可更新及以上 "beyondUpdatable"
     */
    LEVEL_BEYOND_UPDATE(4, Node.UPDATER);

    private final Integer value;

    private final String roleCode;

    public static ExportLevelEnum toEnum(int value) {
        for (ExportLevelEnum e : ExportLevelEnum.values()) {
            if (e.getValue() == value) {
                return e;
            }
        }
        throw new RuntimeException("未知的节点导出权限类型");
    }
}
