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
 * Mini Program Running Environment Type
 * </p>
 *
 * @author liuzijing
 */
@Getter
@AllArgsConstructor
public enum RuntimeEnvType {

    MOBILE("mobile", "01"),

    DESKTOP("desktop", "02");

    @JsonValue
    private final String value;

    private final String code;

    public static RuntimeEnvType toType(String value) {
        for (RuntimeEnvType type : RuntimeEnvType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown runtime environment type");
    }

    public static List<String> toValueList(String codes) {
        List<RuntimeEnvType> runtimeEnvTypes = RuntimeEnvType.toTypeList(codes);
        List<String> list = new ArrayList<>();
        for (RuntimeEnvType runtimeEnvType : runtimeEnvTypes) {
            list.add(runtimeEnvType.value);
        }
        return list;
    }

    public static List<RuntimeEnvType> toTypeList(String codes) {
        List<RuntimeEnvType> runtimeEnvTypes = new ArrayList<>();
        String[] split = StrUtil.split(codes, 2);
        for (String s : split) {
            for (RuntimeEnvType type : RuntimeEnvType.values()) {
                if (type.getCode().equals(s)) {
                    runtimeEnvTypes.add(type);
                }
            }
        }
        return runtimeEnvTypes.stream().distinct().collect(Collectors.toList());
    }

    public static String getRuntimeEnvCode(List<String> runtimeEnv) {
        StringBuilder runtimeEnvsCodes = new StringBuilder();
        if (runtimeEnv != null) {
            for (String runtimeenv : runtimeEnv) {
                runtimeEnvsCodes.append(RuntimeEnvType.toType(runtimeenv).getCode());
            }
        }
        return runtimeEnvsCodes.toString();
    }
}
