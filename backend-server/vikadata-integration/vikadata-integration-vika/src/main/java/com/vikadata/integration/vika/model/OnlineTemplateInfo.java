package com.vikadata.integration.vika.model;

/**
 * <p>
 * 上线模板配置信息
 * </p>
 *
 * @author Chambers
 * @date 2021/3/25
 */
public class OnlineTemplateInfo {
    private String templateName;

    private String[] templateCategoryName;

    private String[] templateTagName;

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String[] getTemplateCategoryName() {
        return templateCategoryName;
    }

    public void setTemplateCategoryName(String[] templateCategoryName) {
        this.templateCategoryName = templateCategoryName;
    }

    public String[] getTemplateTagName() {
        return templateTagName;
    }

    public void setTemplateTagName(String[] templateTagName) {
        this.templateTagName = templateTagName;
    }
}
