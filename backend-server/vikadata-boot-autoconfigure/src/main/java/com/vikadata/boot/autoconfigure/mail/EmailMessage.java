package com.vikadata.boot.autoconfigure.mail;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * Mail Message Template
 * </p>
 *
 * @author Benson Cheung
 */
public class EmailMessage {

    /**
     * Sender Personalized Name
     */
    private String personal;

    /**
     * Recipient list (multiple supported)
     */
    private List<String> to;

    /**
     * Cc list (multiple supported
     */
    private List<String> cc;

    /**
     * Message subject
     */
    private String subject;

    /**
     * Plain text content
     */
    private String plainText;

    /**
     * html text
     */
    private String htmlText;

    /**
     * Embedded resources (pictures, files, etc.)
     */
    private Map<String, InputStream> inlines;

    /**
     * attaches resources
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
