/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.widget.enums;

import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * Mini Program Running Environment Type.
 * </p>
 *
 * @author liuzijing
 */
@Getter
@AllArgsConstructor
public enum RuntimeEnvType {

    MOBILE("mobile", "01"),

    DESKTOP("desktop", "02"),

    ;

    @JsonValue
    private final String value;

    private final String code;

    /**
     * Get the runtime environment type by value.
     *
     * @param value value
     * @return runtime environment type
     */
    public static RuntimeEnvType toType(String value) {
        for (RuntimeEnvType type : RuntimeEnvType.values()) {
            if (type.getValue().equals(value)) {
                return type;
            }
        }
        throw new BusinessException("Unknown runtime environment type");
    }

    /**
     * Get the runtime environment type by code.
     *
     * @param codes code list
     * @return runtime environment type
     */
    public static List<String> toValueList(String codes) {
        List<RuntimeEnvType> runtimeEnvTypes = RuntimeEnvType.toTypeList(codes);
        List<String> list = new ArrayList<>();
        for (RuntimeEnvType runtimeEnvType : runtimeEnvTypes) {
            list.add(runtimeEnvType.value);
        }
        return list;
    }

    /**
     * Get the runtime environment type by code.
     *
     * @param codes code list
     * @return runtime environment type
     */
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

    /**
     * Get the runtime environment type by runtime environment type list.
     *
     * @param runtimeEnv runtime environment type list
     * @return runtime environment type
     */
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
