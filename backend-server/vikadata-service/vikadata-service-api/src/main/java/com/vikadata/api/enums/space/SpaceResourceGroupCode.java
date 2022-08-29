package com.vikadata.api.enums.space;

import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.collection.ListUtil;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 空间站权限分组code
 * </p>
 * @author zoe zheng
 * @date 2022/4/6 16:03
 */
@Getter
@AllArgsConstructor
public enum SpaceResourceGroupCode {

    /**
     * 空间管理
     */
    MANAGE_SPACE("MANAGE_SPACE"),

    /**
     * 管理配置 具有此资源的角色，可以对“全员可见“和“禁止导出维格表”配置进行操作
     */
    MANAGE_WORKBENCH("MANAGE_WORKBENCH"),

    /**
     * 管理成员
     */
    MANAGE_MEMBER("MANAGE_MEMBER"),

    /**
     * 管理小组
     */
    MANAGE_TEAM("MANAGE_TEAM"),

    /**
     * 管理主管理员
     */
    MANAGE_MAIN_ADMIN("MANAGE_MAIN_ADMIN"),

    /**
     * 管理子管理员
     */
    MANAGE_SUB_ADMIN("MANAGE_SUB_ADMIN"),

    /**
     * 管理配置 具有此资源的角色，可以对“允许邀请成员”配置进行操作
     */
    MANAGE_NORMAL_MEMBER("MANAGE_NORMAL_MEMBER"),

    /**
     * 管理模版
     */
    MANAGE_TEMPLATE("MANAGE_TEMPLATE"),

    /**
     * 管理企业安全中心
     */
    MANAGE_SECURITY("MANAGE_SECURITY"),

    /**
     * 管理第三方应用集成
     */
    MANAGE_INTEGRATION("MANAGE_INTEGRATION"),

    /**
     * 管理小组件
     */
    MANAGE_WIDGET("MANAGE_WIDGET"),

    ;

    private final String code;

    public static List<String> codes() {
        return ListUtil.toList(SpaceResourceGroupCode.values()).stream().map(SpaceResourceGroupCode::getCode).collect(Collectors.toList());
    }
}
