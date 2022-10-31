package com.vikadata.social.feishu.model.v3;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.model.BasePageInfo;
import com.vikadata.social.feishu.model.BaseResponse;

/**
 * Get Department Information List Response
 */
@Setter
@Getter
@ToString
public class FeishuV3DeptsResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    @ToString
    public static class Data extends BasePageInfo {

        private List<FeishuDeptObject> items;
    }
}
