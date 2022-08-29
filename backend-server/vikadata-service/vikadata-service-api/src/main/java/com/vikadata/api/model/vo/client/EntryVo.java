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
public class EntryVo {

    private String version;

    private String userInfoVo;

    private String metaContent;

    /**
     * 返回给客户端当前环境
     */
    private String env;

    private String wizards;

    private String locale;
}
