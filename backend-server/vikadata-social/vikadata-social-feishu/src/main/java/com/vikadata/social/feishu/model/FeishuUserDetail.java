package com.vikadata.social.feishu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

/**
 * 用户详情
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:00:43
 */
@Getter
@Setter
@ToString
public class FeishuUserDetail {

    private String name;

    private String namePy;

    private String enName;

    private String employeeId;

    private String employeeNo;

    private String openId;

    private String unionId;

    private Integer status;

    private Integer employeeType;

    @JsonProperty("avatar_72")
    private String avatar72;

    @JsonProperty("avatar_240")
    private String avatar240;

    @JsonProperty("avatar_640")
    private String avatar640;

    private String avatarUrl;

    private Integer gender;

    private String email;

    private String mobile;

    private String description;

    private String country;

    private String city;

    private String workStation;

    @JsonProperty("is_tenant_manager")
    private boolean isTenantManager;

    private Long joinTime;

    private Long updateTime;

    private String leaderEmployeeId;

    private String leaderOpenId;

    private List<String> departments;

    private List<String> openDepartments;

    private Map<String, Object> customAttrs;
}
