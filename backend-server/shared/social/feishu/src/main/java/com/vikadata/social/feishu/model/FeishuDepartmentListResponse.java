package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Get a list of sub-departments
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentListResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data extends BasePageInfo {

        private List<FeishuDepartmentInfo> departmentInfos;
    }
}
