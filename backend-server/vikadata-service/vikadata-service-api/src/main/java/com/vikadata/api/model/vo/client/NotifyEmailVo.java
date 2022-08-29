package com.vikadata.api.model.vo.client;

import lombok.Builder;
import lombok.Data;

/**
 * <p>
 * 客户端入口模版绑定参数
 * </p>
 *
 * @author zoe zheng
 * @date 2020/4/9 7:34 下午
 */
@Data
@Builder
public class NotifyEmailVo {

    /**
     * 发布人
     */
    private String publishUser;

    private String version;

    private String content;
    /**
     * 年份
     */
    private int years;
}
