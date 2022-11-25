package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Shawn Deng
 * @date 2020-12-09 11:02:26
 */
@Setter
@Getter
@ToString
public class FeishuDepartmentDetailResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data {

        private FeishuDepartmentDetail departmentInfo;
    }
}
