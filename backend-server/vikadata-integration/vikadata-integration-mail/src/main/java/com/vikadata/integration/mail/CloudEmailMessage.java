package com.vikadata.integration.mail;

import java.util.List;

/**
 * <p>
 * Cloud platform mail push message template
 * </p>
 *
 */
public class CloudEmailMessage {

    /**
     * sender personalized name
     */
    private String personal;

    /**
     * email subject
     */
    private String subject;

    /**
     * email template ID
     */
    private Long templateId;

    /**
     * variable parameters in the template
     */
    private String templateData;

    /**
     * recipient list (multiple supported)
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
