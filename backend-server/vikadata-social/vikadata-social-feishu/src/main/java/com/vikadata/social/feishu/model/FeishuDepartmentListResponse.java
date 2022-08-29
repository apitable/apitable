package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * 获取子部门列表
 *
 * @author Shawn Deng
 * @date 2020-11-23 16:06:27
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
