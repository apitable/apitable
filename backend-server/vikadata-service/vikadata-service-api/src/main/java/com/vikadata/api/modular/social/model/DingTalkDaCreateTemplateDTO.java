package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p>
 * 钉钉搭创建模版
 * </p>
 * @author zoe zheng
 * @date 2021/5/28 5:36 下午
 */
@Data
public class DingTalkDaCreateTemplateDTO {

    /**
     * 应用实例id
     */
    private String bizAppId;

    /**
     * 移动端打开地址
     */
    private String homepageLink;

    /**
     * pc端打开地址
     */
    private String pcHomepageLink;

    /**
     * 移动端编辑页打开地址
     */
    private String homepageEditLink;

    /**
     * pc端编辑页打开地址
     */
    private String pcHomepageEditLink;
}
