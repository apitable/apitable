package com.vikadata.social.feishu.model;

import lombok.Getter;
import lombok.Setter;

import com.vikadata.social.feishu.model.v3.Avatar;

/**
 * <p> 
 * 企业信息
 * </p> 
 * @author Shawn Deng 
 * @date 2021/7/7 15:32
 */
@Setter
@Getter
public class FeishuTenantInfo {

    /**
     * 企业名称
     */
    private String name;

    /**
     * 企业编号
     */
    private String displayId;

    /**
     * 个人版/团队版标志
     * 0：团队版
     * 2：个人版
     */
    private String tenantTag;

    /**
     * 企业标识
     */
    private String tenantKey;

    /**
     * 企业头像
     */
    private Avatar avatar;
}
