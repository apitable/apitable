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

package com.apitable.workspace.dto;

import java.util.List;
import java.util.Map;

import cn.hutool.json.JSONObject;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DatasheetSnapshot {

    private Meta meta;

    @Setter
    @Getter
    public static class Meta {

        private Map<String, Field> fieldMap;

        private List<View> views;
    }

    @Setter
    @Getter
    public static class Field {

        private String id;

        private Integer type;

        private String name;

        private JSONObject property;
    }

    @Setter
    @Getter
    public static class View {

        private String id;

        private List<Column> columns;
    }

    @Setter
    @Getter
    public static class Column {

        private String fieldId;
    }
}
