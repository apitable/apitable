package com.vikadata.social.feishu.model.v3;

import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * v3 Version User Object
 */
@Getter
@Setter
public class FeishuUserObject {

    private String unionId;

    private String openId;

    private String userId;

    private String name;

    private String enName;

    private String email;

    private String mobile;

    @JsonProperty("mobile_visible")
    private boolean mobileVisible;

    private Integer gender;

    private Avatar avatar;

    private UserStatus status;

    private List<String> departmentIds;

    private String leader_user_id;

    private String country;

    private String city;

    private String workStation;

    @JsonProperty("is_tenant_manager")
    private boolean isTenantManager;

    private Long joinTime;

    private String employeeNo;

    private Integer employeeType;

    private List<UserOrder> orders;

    private List<CustomAttr> customAttrs;

    private String enterpriseEmail;

    private String jobTitle;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FeishuUserObject that = (FeishuUserObject) o;
        return unionId.equals(that.unionId) && openId.equals(that.openId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(unionId, openId);
    }
}
