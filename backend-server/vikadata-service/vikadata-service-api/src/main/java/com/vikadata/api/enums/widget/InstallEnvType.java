package com.vikadata.api.enums.widget;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonValue;
import com.vikadata.core.exception.BusinessException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 *  小程序安装环境类型
 * </p>
 *
 *
 * @author liuzijing
 * @date 2022/6/20
 */
@Getter
@AllArgsConstructor
public enum InstallEnvType {

    /**
     * 仪表盘
     */
    DASHBOARD("dashboard","01"),

    /**
     * 小程序面板
     */
    PANEL("panel", "02");

    @JsonValue
    private final String value;

    private final String code;

    public static InstallEnvType toType(String value) {
        for (InstallEnvType type : InstallEnvType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("未知安装环境类型类型");
    }

    public static List<String> toValueList(String codes){
        List<InstallEnvType> installEnvTypes = InstallEnvType.toTypeList(codes);
        List<String> list = new ArrayList<>();
        for (InstallEnvType installEnvType : installEnvTypes){
            list.add(installEnvType.value);
        }
        return list;
    }

    public static List<InstallEnvType> toTypeList(String codes) {
        List<InstallEnvType> installEnvTypes = new ArrayList<>();
        String[] split = StrUtil.split(codes, 2);
        for(String s : split){
            for (InstallEnvType type : InstallEnvType.values()) {
                if (type.getCode().equals(s)) {
                    installEnvTypes.add(type);
                }
            }
        }
        return installEnvTypes.stream().distinct().collect(Collectors.toList());
    }

    public static String getInstallEnvCode(List<String> installEnv) {
        // 获取小组件安装环境编码
        String installEnvsCodes = "";
        if(installEnv != null){
            for(String installenv : installEnv){
                installEnvsCodes +=(InstallEnvType.toType(installenv).getCode());
            }
        }
        return installEnvsCodes;
    }
}
