package com.vikadata.boot.autoconfigure.mail;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 邮件消息模板
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/8/23 13:31
 */
public class EmailMessage {

    /**
     * 发件人个性化名称
     */
    private String personal;

    /**
     * 收件人列表(支持多个)
     */
    private List<String> to;

    /**
     * 抄送人列表(支持多个)
     */
    private List<String> cc;

    /**
     * 邮件主题
     */
    private String subject;

    /**
     * 纯文本内容
     */
    private String plainText;

    /**
     * HTML文本
     */
    private String htmlText;

    /**
     * 内嵌资源（图片、文件等等）
     */
    private Map<String, InputStream> inlines;

    /**
     * 附件
     */
    private List<EmailAttach> attaches;

    public String getPersonal() {
        return personal;
    }

    public void setPersonal(String personal) {
        this.personal = personal;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }

    public List<String> getCc() {
        return cc;
    }

    public void setCc(List<String> cc) {
        this.cc = cc;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getPlainText() {
        return plainText;
    }

    public void setPlainText(String plainText) {
        this.plainText = plainText;
    }

    public String getHtmlText() {
        return htmlText;
    }

    public void setHtmlText(String htmlText) {
        this.htmlText = htmlText;
    }

    public Map<String, InputStream> getInlines() {
        return inlines;
    }

    public void setInlines(Map<String, InputStream> inlines) {
        this.inlines = inlines;
    }

    public List<EmailAttach> getAttaches() {
        return attaches;
    }

    public void setAttaches(List<EmailAttach> attaches) {
        this.attaches = attaches;
    }

    public static class EmailAttach {

        private String attachName;

        private InputStream source;

        public String getAttachName() {
            return attachName;
        }

        public void setAttachName(String attachName) {
            this.attachName = attachName;
        }

        public InputStream getSource() {
            return source;
        }

        public void setSource(InputStream source) {
            this.source = source;
        }
    }
}
