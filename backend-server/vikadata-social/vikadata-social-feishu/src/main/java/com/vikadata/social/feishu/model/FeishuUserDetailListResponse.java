package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * 获取部门用户详情
 *
 * @author Shawn Deng
 * @date 2020-11-23 16:06:27
 */
@Setter
@Getter
@ToString
public class FeishuUserDetailListResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data extends BasePageInfo {

        private List<FeishuUserDetail> userInfos;
    }
}
