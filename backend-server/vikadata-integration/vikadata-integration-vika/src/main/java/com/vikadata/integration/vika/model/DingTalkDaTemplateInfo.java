package com.vikadata.integration.vika.model;

/**
 * <p>
 * 钉钉搭模版配置
 * </p>
 * @author zoe zheng
 * @date 2022/1/4 11:36 AM
 */
public class DingTalkDaTemplateInfo {

    private String templateId;

    private String iconUrl;

    private String iconName;

    private String templateName;

    private String iconMediaId;

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public String getIconMediaId() {
        return iconMediaId;
    }

    public void setIconMediaId(String iconMediaId) {
        this.iconMediaId = iconMediaId;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }
}
