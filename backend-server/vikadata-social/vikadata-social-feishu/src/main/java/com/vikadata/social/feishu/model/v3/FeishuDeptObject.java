package com.vikadata.social.feishu.model.v3;

import java.util.List;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;

/**
 * v3 Version Department Object
 */
@Setter
@Getter
public class FeishuDeptObject {

    private String name;

    private I18n i18n_name;

    private String parentDepartmentId;

    private String departmentId;

    private String openDepartmentId;

    private String leaderUserId;

    private String chatId;

    private String order;

    private List<String> unitIds;

    private int memberCount;

    private DeptStatus status;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FeishuDeptObject that = (FeishuDeptObject) o;
        return departmentId.equals(that.departmentId) && openDepartmentId.equals(that.openDepartmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(departmentId, openDepartmentId);
    }
}
