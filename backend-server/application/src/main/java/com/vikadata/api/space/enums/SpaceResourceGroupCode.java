package com.vikadata.api.space.enums;

import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.collection.ListUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * space resource group code
 * </p>
 * @author zoe zheng
 */
@Getter
@AllArgsConstructor
public enum SpaceResourceGroupCode {

    MANAGE_SPACE("MANAGE_SPACE"),

    MANAGE_WORKBENCH("MANAGE_WORKBENCH"),

    MANAGE_MEMBER("MANAGE_MEMBER"),

    MANAGE_TEAM("MANAGE_TEAM"),

    MANAGE_MAIN_ADMIN("MANAGE_MAIN_ADMIN"),

    MANAGE_SUB_ADMIN("MANAGE_SUB_ADMIN"),

    MANAGE_NORMAL_MEMBER("MANAGE_NORMAL_MEMBER"),

    MANAGE_TEMPLATE("MANAGE_TEMPLATE"),

    MANAGE_SECURITY("MANAGE_SECURITY"),

    MANAGE_INTEGRATION("MANAGE_INTEGRATION"),

    MANAGE_WIDGET("MANAGE_WIDGET"),

    ;

    private final String code;

    public static List<String> codes() {
        return ListUtil.toList(SpaceResourceGroupCode.values()).stream().map(SpaceResourceGroupCode::getCode).collect(Collectors.toList());
    }
}
