package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>
 * 上传图片 响应结构
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/12/2 10:58
 */
@Setter
@Getter
@ToString
public class FeishuImagePutResponse extends BaseResponse {

    private Data data;

    @Setter
    @Getter
    public static class Data {
        private String messageId;
    }
}
