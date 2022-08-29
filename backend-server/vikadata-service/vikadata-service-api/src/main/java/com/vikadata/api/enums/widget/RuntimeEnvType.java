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
 * 小程序运行环境类型
 * </p>
 *
 * @author liuzijing
 * @date 2022/6/20
 */
@Getter
@AllArgsConstructor
public enum RuntimeEnvType {

    /**
     * 移动端
     */
    MOBILE("mobile", "01"),

    /**
     * 桌面端
     */
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
        throw new BusinessException("未知运行环境类型");
    }

    public static List<String> toValueList(String codes){
        List<RuntimeEnvType> runtimeEnvTypes = RuntimeEnvType.toTypeList(codes);
        List<String> list = new ArrayList<>();
        for (RuntimeEnvType runtimeEnvType : runtimeEnvTypes){
            list.add(runtimeEnvType.value);
        }
        return list;
    }

    public static List<RuntimeEnvType> toTypeList(String codes) {
        List<RuntimeEnvType> runtimeEnvTypes = new ArrayList<>();
        String[] split = StrUtil.split(codes, 2);
        for(String s : split){
            for (RuntimeEnvType type : RuntimeEnvType.values()) {
                if (type.getCode().equals(s)) {
                    runtimeEnvTypes.add(type);
                }
            }
        }
        return runtimeEnvTypes.stream().distinct().collect(Collectors.toList());
    }

    public static String getRuntimeEnvCode(List<String> runtimeEnv) {
        // 获取小组件运行环境编码
        String runtimeEnvsCodes = "";
        if(runtimeEnv != null){
            for(String runtimeenv : runtimeEnv){
                runtimeEnvsCodes += (RuntimeEnvType.toType(runtimeenv).getCode());
            }
        }
        return runtimeEnvsCodes;
    }
}
