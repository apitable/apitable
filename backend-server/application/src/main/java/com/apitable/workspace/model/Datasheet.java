package com.apitable.workspace.model;

import cn.hutool.json.JSONUtil;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * datasheet class object, mapping db model.
 *
 * @author Shawn Deng
 */
@Data
public class Datasheet {

    private Meta meta;

    private Records records;

    /**
     * datasheet meta.
     */
    @Setter
    @Getter
    public static class Meta {

        private FieldMap fieldMap;

        private Views views;

        public String toJsonString() {
            return this.toJsonString(false);
        }

        public String toJsonString(boolean pretty) {
            return pretty ? JSONUtil.toJsonPrettyStr(this) : JSONUtil.toJsonStr(this);
        }
    }

    /**
     * field map in meta.
     */
    public static class FieldMap extends HashMap<String, Field> {
    }


    /**
     * field object.
     */
    @Setter
    @Getter
    public static class Field {

        private String id;

        private Integer type;

        private String name;

        private Map<String, Object> property;
    }

    /**
     * record list.
     */
    public static class Views extends ArrayList<View> {
    }

    /**
     * view object.
     */
    @Setter
    @Getter
    public static class View {

        private String id;

        private String name;

        private Integer type;

        private Columns columns;

        private Rows rows;

        private Boolean autoSave = false;

        private Boolean displayHiddenColumnWithinMirror = false;

        private Integer frozenColumnCount;
    }

    /**
     * column list.
     */
    public static class Columns extends ArrayList<Column> {
    }

    /**
     * column in view.
     */
    @Setter
    @Getter
    public static class Column {

        private String fieldId;
    }

    /**
     * row list.
     */
    public static class Rows extends ArrayList<Row> {
    }

    /**
     * row in view.
     */
    @Setter
    @Getter
    public static class Row {

        private String recordId;
    }

    /**
     * record list.
     */
    public static class Records extends ArrayList<Record> {
    }

    /**
     * record object.
     */
    @Setter
    @Getter
    public static class Record {

        private String id;

        private RecordDataMap data;

        private FieldUpdateInfo fieldUpdatedInfo;

        /**
         * init fieldUpdateInfo.
         *
         * @param userUuid  created by
         * @param createdAt created at
         */
        public void initFieldUpdateInfo(String userUuid, Long createdAt) {
            fieldUpdatedInfo = new FieldUpdateInfo();
            fieldUpdatedInfo.setCreatedAt(createdAt);
            fieldUpdatedInfo.setCreatedBy(userUuid);
        }
    }

    /**
     * record object.
     */
    public static class RecordDataMap extends HashMap<String, List<RecordData>> {

        public String toJsonString() {
            return JSONUtil.toJsonStr(this);
        }
    }

    /**
     * record data.
     */
    @Setter
    @Getter
    public static class RecordData {

        private String link;

        private String text;

        private Integer type;

    }

    /**
     * record field update info.
     */
    @Setter
    @Getter
    public static class FieldUpdateInfo {

        private Long createdAt;

        private String createdBy;

        private FieldUpdatedMap fieldUpdatedMap;

        public String toJsonString() {
            return JSONUtil.toJsonStr(this);
        }
    }

    /**
     * field update map in record.
     */
    public static class FieldUpdatedMap extends HashMap<String, FieldUpdated> {
    }

    /**
     * record field update info.
     */
    @Setter
    @Getter
    public static class FieldUpdated {

        private Long at;

        private String by;
    }
}
