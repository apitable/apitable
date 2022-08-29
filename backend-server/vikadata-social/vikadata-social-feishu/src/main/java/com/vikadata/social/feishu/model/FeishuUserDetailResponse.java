package com.vikadata.social.feishu.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 飞书用户信息
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/7 11:12
 */
@Getter
@Setter
@ToString
public class FeishuUserDetailResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private List<FeishuUserDetail> userInfos;
    }
}
