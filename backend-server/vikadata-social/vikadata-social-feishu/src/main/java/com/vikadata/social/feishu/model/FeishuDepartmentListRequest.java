package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 获取子部门列表 请求参数
 *
 * @author Shawn Deng
 * @date 2020-11-23 16:03:11
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentListRequest {

    private String openDepartmentId;

    private String departmentId;

    private String pageToken;

    private Integer pageSize = 100;

    private Boolean fetchChild = true;
}
