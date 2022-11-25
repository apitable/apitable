package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get department user details Request parameters
 */
@Setter
@Getter
@ToString
public class FeishuUserDetailListRequest {

    private String openDepartmentId;

    private String departmentId;

    private String pageToken;

    private Integer pageSize = 100;

    private Boolean fetchChild = true;
}
