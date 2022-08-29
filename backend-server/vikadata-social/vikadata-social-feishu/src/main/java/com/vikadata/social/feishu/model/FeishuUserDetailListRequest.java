package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取部门用户详情 请求参数
 *
 * @author Shawn Deng
 * @date 2020-12-09 13:04:12
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
