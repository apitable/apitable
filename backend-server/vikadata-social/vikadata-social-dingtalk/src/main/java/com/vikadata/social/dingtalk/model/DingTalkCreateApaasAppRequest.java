package com.vikadata.social.dingtalk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p> 
 * 创建apaas应用
 * </p> 
 * @author zoe zheng 
 * @date 2021/9/29 10:45
 */
@Setter
@Getter
@ToString
public class DingTalkCreateApaasAppRequest {

    @JsonProperty("appName")
    private String appName;

    @JsonProperty("appDesc")
    private String appDesc;

    /**
     * 应用图标mediaId。可使用开放接口上传多媒体文件 生成。
     */
    @JsonProperty("appIcon")
    private String appIcon;

    /**
     * 移动端打开地址。
     */
    @JsonProperty("homepageLink")
    private String homepageLink;

    /**
     * PC端打开地址。
     */
    @JsonProperty("pcHomepageLink")
    private String pcHomepageLink;

    /**
     * 应用管理地址。
     */
    @JsonProperty("ompLink")
    private String ompLink;

    /**
     * 应用移动端编辑地址。
     */
    @JsonProperty("homepageEditLink")
    private String homepageEditLink;

    /**
     * 应用PC端编辑地址。
     */
    @JsonProperty("pcHomepageEditLink")
    private String pcHomepageEditLink;

    /**
     * 操作人userId。
     */
    @JsonProperty("opUserId")
    private String opUserId;

    /**
     * ISV侧的应用id。
     */
    @JsonProperty("bizAppId")
    private String bizAppId;

    /**
     * 应用模板key。
     */
    @JsonProperty("templateKey")
    private String templateKey;
}
