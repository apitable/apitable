package com.vikadata.api.enums.widget;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

import com.vikadata.core.exception.BusinessException;

/**
 * <p>
 *  Mini Program Installation Environment Type
 * </p>
 *
 * @author liuzijing
 */
@Getter
@AllArgsConstructor
public enum InstallEnvType {

    DASHBOARD("dashboard", "01"),

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
        throw new BusinessException("Unknown installation environment type type");
    }

    public static List<String> toValueList(String codes) {
        List<InstallEnvType> installEnvTypes = InstallEnvType.toTypeList(codes);
        List<String> list = new ArrayList<>();
        for (InstallEnvType installEnvType : installEnvTypes) {
            list.add(installEnvType.value);
        }
        return list;
    }

    public static List<InstallEnvType> toTypeList(String codes) {
        List<InstallEnvType> installEnvTypes = new ArrayList<>();
        String[] split = StrUtil.split(codes, 2);
        for (String s : split) {
            for (InstallEnvType type : InstallEnvType.values()) {
                if (type.getCode().equals(s)) {
                    installEnvTypes.add(type);
                }
            }
        }
        return installEnvTypes.stream().distinct().collect(Collectors.toList());
    }

    public static String getInstallEnvCode(List<String> installEnv) {
        StringBuilder installEnvsCodes = new StringBuilder();
        if (installEnv != null) {
            for (String installenv : installEnv) {
                installEnvsCodes.append(InstallEnvType.toType(installenv).getCode());
            }
        }
        return installEnvsCodes.toString();
    }
}
