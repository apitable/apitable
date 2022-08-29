package com.vikadata.social.feishu.model.v3;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.model.BasePageInfo;
import com.vikadata.social.feishu.model.BaseResponse;

/**
 * 获取部门用户详情
 *
 * @author Shawn Deng
 * @date 2020-11-23 16:06:27
 */
@Setter
@Getter
@ToString
public class FeishuV3UsersResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data extends BasePageInfo {

        private List<FeishuUserObject> items;
    }
}
