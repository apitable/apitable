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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Getter;

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

    PANEL("panel", "02"),

    ;

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
