package com.vikadata.integration.mail;

import java.util.List;

/**
 * <p>
 * 云平台邮件推送消息模板
 * </p>
 *
 * @author Chambers
 * @date 2022/2/9
 */
public class CloudEmailMessage {

    /**
     * 发件人个性化名称
     */
    private String personal;

    /**
     * 邮件主题
     */
    private String subject;

    /**
     * 邮件模板ID
     */
    private Long templateId;

    /**
     * 模板中的变量参数
     */
    private String templateData;

    /**
     * 收件人列表(支持多个)
     */
    private List<String> to;

    public String getPersonal() {
        return personal;
    }

    public void setPersonal(String personal) {
        this.personal = personal;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }

    public String getTemplateData() {
        return templateData;
    }

    public void setTemplateData(String templateData) {
        this.templateData = templateData;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }
}
