package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;

/**
 * Get department list information query parameters
 */
@Getter
@Setter
public class FeishuV3DeptsRequest {

    private String userIdType;

    private String departmentIdType;

    private String parentDepartmentId;

    private Integer pageSize = 50;

    private String pageToken;

    private Boolean fetchChild = true;
}
