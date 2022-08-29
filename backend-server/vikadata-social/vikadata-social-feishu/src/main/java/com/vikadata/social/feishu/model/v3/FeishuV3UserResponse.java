package com.vikadata.social.feishu.model.v3;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.feishu.model.BaseResponse;

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
public class FeishuV3UserResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {

        private FeishuUserObject user;
    }
}
