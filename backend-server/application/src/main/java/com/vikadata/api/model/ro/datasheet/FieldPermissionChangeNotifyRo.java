package com.vikadata.api.model.ro.datasheet;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.enums.datasheet.FieldPermissionChangeEvent;
import com.vikadata.api.model.vo.datasheet.FieldRoleSetting;
import com.vikadata.api.model.vo.node.FieldPermission;

/**
 * <p>
 * Field Permission Change Notice Request Parameters
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class FieldPermissionChangeNotifyRo {

    private FieldPermissionChangeEvent event;

    private String datasheetId;

    private String fieldId;

    private String operator;

    private Long changeTime;

    private FieldRoleSetting setting;

    private List<ChangeObject> changes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChangeObject {

        private List<String> uuids;

        private String role;

        private FieldPermission permission;
    }

}
