package com.vikadata.api.workspace.model;

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
